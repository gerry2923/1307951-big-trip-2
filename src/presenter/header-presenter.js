
import { remove, render } from '../framework/render';
import TripInfoView from '../view/trip-info-view/trip-info-view';
import FilterPresenter from './filter-presenter';
import AddPointButtonView from '../view/add-point-button-view/add-point-button-view';
import { UpdateType } from '../const';
import FilterView from '../view/filter-view/filter-view';
import DisabledFilterView from '../view/filter-view/disabled-filter-view';
import AddDisabledPointButtonView from '../view/add-point-button-view/add-disabled-point-button-view';
import { sortClosestDayFirst, getTripDatePeriod } from '../utils/point';


/**
 * не будет отдельной шапки. нужно проверять наличие точек маршрута
 */
export default class HeaderPresenter {
  #filtersModel = null;
  #pointsModel = null;

  #headerContainer = null;

  #tripInfoComponent = null;
  #newButtonComponent = null;
  #disabledHeaderComponent = null;
  #disabledNewButtonComponent = null;

  #filterPresenter = null;

  #allDestinations = null;
  #destinationNames = null;
  #totalPrice = null;
  #tripTime = null;

  #addPointButtonClickHandler = null;

  #isLoading = true;

  #handleAddPointButtonClick = () => {
    this.#addPointButtonClickHandler();
  };

  constructor({ pointsModel, filtersModel, /*destinations,*/ headerContainer, onAddPointButtonClick }) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#headerContainer = headerContainer;
    // this.#allDestinations = destinations;
    // this.#newButtonPresenter = newButtonPresenter;
    this.#addPointButtonClickHandler = onAddPointButtonClick;

    this.#pointsModel.addObserver(this.#handleModelPoint);
  }

  //  #handleModelPoint = (updateType, data) => {
  #handleModelPoint = (updateType) => {
    console.log(`action type is ${updateType}`);
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
        remove(this.#tripInfoComponent);
        this.renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this.clearHeader();
        this.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.clearHeader();
        this.init();
        console.log('загрузка данных в хедере');
        break;
    }
  };

  /*
    1. Создать инфо по маршруту из городов и даты
    2. Общая стоимость
    3. фильтр
    4. кнопка
  */
  #extractModelCityNames = () => {
    const destinations = new Map(this.#allDestinations.map((destination) => [destination.id, destination.name]));
    const cityNames = this.#pointsModel.points.map((point) => destinations.get(point.destination)).filter(Boolean);
    return cityNames;
  };

  #extractTripTime = () => {
    const dateStartTrip = [...this.#pointsModel.points].sort(sortClosestDayFirst)[0].dateFrom;
    const dateEndTrip = [...this.#pointsModel.points].sort(sortClosestDayFirst)[this.#pointsModel.points.length - 1].dateFrom;
    const finalString = getTripDatePeriod(dateStartTrip, dateEndTrip);
    return finalString;
  };

  #extractModelTotalPrice = () => {
    let price = 0;

    this.#pointsModel.points.forEach((point) => {
      price += point.basePrice;
      if (point.offers.length !== 0) {
        this.#pointsModel.offers.forEach((offerObj) => {
          if (offerObj.type === point.type) {

            const pointOffers = new Set(point.offers);
            offerObj.offers.forEach((offerItem) => {
              if (pointOffers.has(offerItem.id)) {
                price += offerItem.price;
              }
            });
          }
        });
      }
    });
    return price;
  };

  // этот метод запускается только тогда, когда получены данные с сервера
  // и при этом есть контент, т.е. точки
  renderTripInfo() {
    // после загрузки из модели можно взять все объекты точек назначения
    if (this.#allDestinations === null) {
      this.#allDestinations = this.#pointsModel.destinations;
    }

    if (this.#pointsModel.points === null ||
       this.#pointsModel.points.length === 0) {
      return;
    }

    this.#destinationNames = this.#extractModelCityNames();
    this.#totalPrice = this.#extractModelTotalPrice();
    this.#tripTime = this.#extractTripTime();

    if(this.#tripInfoComponent !== null) {
      remove(this.#tripInfoComponent);
    }

    this.#tripInfoComponent = new TripInfoView({
      destinationNames: this.#destinationNames,
      price: this.#totalPrice,
      tripDuration: this.#tripTime,
    });

    render(this.#tripInfoComponent, this.#headerContainer, 'afterbegin');
  }

  #renderFilter() {
    this.#filterPresenter = new FilterPresenter({
      headerContainer: this.#headerContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
    });

    this.#filterPresenter.init();
  }

  renderNewButton() {
    this.#newButtonComponent = new AddPointButtonView({
      onButtonClick: this.#handleAddPointButtonClick,
    });

    render(this.#newButtonComponent, this.#headerContainer);
  }

  // предполагается, что компоненты обновляются только при создании и редактировании
  toggleAddPointButtonState() {
    this.#newButtonComponent.element.disabled = !this.#newButtonComponent.element.disabled;
  }

  clearTripInfo() {
    remove(this.#tripInfoComponent);
  }

  clearHeader() {
    remove(this.#tripInfoComponent);
    remove(this.#newButtonComponent);
    remove(this.#disabledHeaderComponent);
    remove(this.#disabledNewButtonComponent);
    if (this.#filterPresenter) {
      this.#filterPresenter.destroy();
    }
  }

  #renderDisabledHeaderElements() {
    // this.clearHeader();
    this.#disabledHeaderComponent = new DisabledFilterView();
    render(this.#disabledHeaderComponent, this.#headerContainer);

    this.#disabledNewButtonComponent = new AddDisabledPointButtonView();
    render(this.#disabledNewButtonComponent, this.#headerContainer);
  }

  renderHeaderElements() {
    // this.clearHeader();
    this.#renderFilter();
    // this.#newButtonPresenter.init(this.#headerContainer);
    this.renderNewButton();
  }


  init() {
    if (this.#isLoading) {
      this.#renderDisabledHeaderElements();
      return;
    }

    if(this.#pointsModel.points && this.#pointsModel.points.length !== 0) {
      this.renderTripInfo();
    }
    // // тут нужно проверить статус. Если статуса нет
    this.renderHeaderElements();
    console.log('header перерисовка');
    //

  }
}
