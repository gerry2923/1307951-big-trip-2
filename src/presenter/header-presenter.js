
import TripInfoView from '../view/trip-info-view/trip-info-view';
import FilterPresenter from './filter-presenter';
import AddPointButtonView from '../view/add-point-button-view/add-point-button-view';
import DisabledFilterView from '../view/filter-view/disabled-filter-view';
import AddDisabledPointButtonView from '../view/add-point-button-view/add-disabled-point-button-view';

import { remove, render } from '../framework/render';
import { sortClosestDayFirst, getTripDatePeriod } from '../utils/point';
import { UpdateType } from '../const';


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

  #disableNewPointButton = () => {
    this.#newButtonComponent.isDisabled = true;
    this.#newButtonComponent.rerenderButton();

    this.#addPointButtonClickHandler();
  };

  enableNewPointButton() {
    this.#newButtonComponent.isDisabled = false;
    this.#newButtonComponent.rerenderButton();
  }


  constructor({ pointsModel, filtersModel, headerContainer, onAddPointButtonClick }) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#headerContainer = headerContainer;
    this.#addPointButtonClickHandler = onAddPointButtonClick;

    this.#pointsModel.addObserver(this.#handleModelPoint);
  }

  #handleModelPoint = (updateType) => {
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
        break;

    }
  };

  #extractModelCityNames = () => {
    const destinations = new Map(this.#allDestinations.map((destination) => [destination.id, destination.name]));
    const cityNames = this.#pointsModel.points.map((point) => destinations.get(point.destination)).filter(Boolean);
    return cityNames;
  };

  #extractTripTime = () => {
    const dateStartTrip = [...this.#pointsModel.points].sort(sortClosestDayFirst)[0].dateFrom;
    const dateEndTrip = [...this.#pointsModel.points].sort(sortClosestDayFirst)[this.#pointsModel.points.length - 1].dateTo;
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


  renderTripInfo() {

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

  renderNewPointButton() {
    this.#newButtonComponent = new AddPointButtonView({
      onButtonClick: this.#disableNewPointButton,
    });

    render(this.#newButtonComponent, this.#headerContainer);
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
    this.#disabledHeaderComponent = new DisabledFilterView();
    render(this.#disabledHeaderComponent, this.#headerContainer);

    this.#disabledNewButtonComponent = new AddDisabledPointButtonView();
    render(this.#disabledNewButtonComponent, this.#headerContainer);
  }

  renderHeaderElements() {
    this.#renderFilter();
    this.renderNewPointButton();
  }


  init() {
    if (this.#isLoading) {
      this.#renderDisabledHeaderElements();
      return;
    }

    if(this.#pointsModel.points && this.#pointsModel.points.length !== 0) {
      this.renderTripInfo();
    }
    this.renderHeaderElements();

  }
}
