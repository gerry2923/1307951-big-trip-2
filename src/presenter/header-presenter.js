
import { render } from '../framework/render';
import TripInfoView from '../view/trip-info-view/trip-info-view';
import FilterPresenter from './filter-presenter';
import AddPointButtonView from '../view/add-point-button-view/add-point-button-view';


/**
 * не будет отдельной шапки. нужно проверять наличие точек маршрута
 */
export default class HeaderPresenter {
  #filtersModel = null;
  #pointsModel = null;

  #headerContainer = null;

  #tripInfoComponent = null;
  #newButtonComponent = null;

  #filterPresenter = null;
  // #newButtonPresenter = null;

  #allDestinations = null;
  #destinationNames = null;
  #totalPrice = null;

  #addPointButtonClickHandler = null;


  #handleAddPointButtonClick = () => {
    this.#addPointButtonClickHandler();
  };

  #extractModelCityNames = () => {
    const pointsIds = new Set(this.#pointsModel.points.map((point) => point.destination));

    this.#destinationNames = this.#allDestinations.
      filter((destination) => pointsIds.has(destination.id)).
      map((destination) => destination.name);

    console.log(this.#destinationNames);
  };

  #extractModelTotalPrice = () => {
    let price = 0;

    this.#pointsModel.points.forEach((point) => {
      price += point.basePrice;
    });

    return price;
  };


  constructor({ pointsModel, filtersModel, destinations, headerContainer, onAddPointButtonClick }) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#headerContainer = headerContainer;
    this.#allDestinations = destinations;
    // this.#newButtonPresenter = newButtonPresenter;
    this.#addPointButtonClickHandler = onAddPointButtonClick;

    if (this.#pointsModel.points !== null || this.#pointsModel.points.length !== 0) {
      this.#extractModelCityNames(destinations);
      this.#totalPrice = this.#extractModelTotalPrice();
    }

  }

  /*
    1. Создать инфо по маршруту из городов и даты
    2. Общая стоимость
    3. фильтр
    4. кнопка
  */

  #renderTripInfo() {
    this.#tripInfoComponent = new TripInfoView({
      destinationPoints: this.#destinationNames,
      price: this.#totalPrice,
    });
    render(this.#tripInfoComponent, this.#headerContainer);
  }

  #renderFilter() {
    this.#filterPresenter = new FilterPresenter({
      headerContainer: this.#headerContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
    });

    this.#filterPresenter.init();
  }

  // предполагается, что компоненты обновляются только при создании и редактировании
  toggleAddPointButtonState() {
    this.#newButtonComponent.element.disabled = !this.#newButtonComponent.element.disabled;
  }

  init() {

    if(this.#pointsModel.points.length !== 0) {
      this.#renderTripInfo();
    }

    this.#renderFilter();
    // this.#newButtonPresenter.init(this.#headerContainer);

    this.#newButtonComponent = new AddPointButtonView({
      onButtonClick: this.#handleAddPointButtonClick,
    });

    render(this.#newButtonComponent, this.#headerContainer);

  }
}
