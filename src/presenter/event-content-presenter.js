import { render } from '../framework/render.js';
import SortView from '../view/sort-view/sort-view.js';
import EventListPresenter from './event-list-presenter.js';
import EventItemPresenter from './event-item-presenter.js';


export default class EventContentPresenter {
  #eventContainer = null;
  #tripEventsModel = null;
  #eventListPresenter = null;
  #eventItemPresenters = [];
  #tripEvents = null;

  constructor({eventsContainer, tripEventsModel}) {
    this.#eventContainer = eventsContainer;
    this.#tripEventsModel = tripEventsModel;

  }

  #setEventListElement() {
    this.#eventListPresenter = new EventListPresenter({listContainer: this.#eventContainer});
    this.#eventListPresenter.init();
    this.#fillListWithEventElements();
  }

  #prepareEventArguments(tripEventModel) {
    return {
      dateFrom: tripEventModel.dateFrom,
      dateTo: tripEventModel.dateTo,
      basePrice: tripEventModel.basePrice,
      type: tripEventModel.type,
      title: this.#tripEventsModel.getTripTitle(tripEventModel),
      offers: this.#tripEventsModel.getOffersByEvent(tripEventModel),
    };
  }

  #prepareFormArguments(tripEventModel) {
    return {
      dateFrom: tripEventModel.dateFrom,
      dateTo: tripEventModel.dateTo,
      basePrice: tripEventModel.basePrice,
      type: tripEventModel.type,
      destination: this.#tripEventsModel.getDestinationPoint(tripEventModel.destination),
      allOffers: this.#tripEventsModel.getAllOffersByType(tripEventModel.type),
      appliedOffers: this.#tripEventsModel.getOffersByEvent(tripEventModel)
    };
  }

  #fillListWithEventElements() {
    this.#tripEvents.forEach((tripEventModel) => {
      const eventParam = this.#prepareEventArguments(tripEventModel);
      const formParam = this.#prepareFormArguments(tripEventModel);

      const eventItemPresenter = new EventItemPresenter({
        listContainer: this.#eventListPresenter.element,
        eventParameters: eventParam,
        formParameters: formParam });

      eventItemPresenter.init();

      this.#eventItemPresenters.push(eventItemPresenter);
    });
  }

  #setSortFormElement() {
    this.sortForm = new SortView();

    if (this.#eventContainer.childElementCount === 1) {
      render(this.sortForm, this.#eventContainer);
      // this.#eventContainer.appendChild(this.sortForm);

    } else if (this.#eventContainer.childElementCount > 1) {

      this.#eventContainer.insertBefore(this.sortForm.element, this.#eventContainer.firstElementChild.nextElementSibling);
    }
  }

  init() {
    this.#tripEvents = [...this.#tripEventsModel.getTripEvents()];
    this.#setEventListElement();
    this.#setSortFormElement();
  }

}
