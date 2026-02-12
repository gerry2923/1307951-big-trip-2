import { render } from '../framework/render.js';
import SortView from '../view/sort-view/sort-view.js';
import EventListPresenter from './event-list-presenter.js';
import EventItemPresenter from './event-item-presenter.js';
// import { updateItem } from '../utils/common.js';
import NoEventsView from '../view/no-events-view/no-events-view.js';


export default class EventContentPresenter {
  #eventContainer = null;
  #tripEventsModel = null;
  #eventListPresenter = null;
  #eventItemPresenters = new Map();
  #eventNoView = null;
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

  #prepareEventArguments(tripEvent) {
    return {
      eventModel: tripEvent,
      title: this.#tripEventsModel.getTripTitle(tripEvent),
      offers: this.#tripEventsModel.getOffersByEvent(tripEvent),
    };
  }

  #prepareFormArguments(tripEvent) {
    return {
      eventModel: tripEvent,
      destination: this.#tripEventsModel.getDestinationPoint(tripEvent.destination),
      allOffers: this.#tripEventsModel.getAllOffersByType(tripEvent.type),
      appliedOffers: this.#tripEventsModel.getOffersByEvent(tripEvent)
    };
  }

  #fillListWithEventElements() {
    this.#tripEvents.forEach((tripEvent) => {

      const eventParam = this.#prepareEventArguments(tripEvent);
      const formParam = this.#prepareFormArguments(tripEvent);

      const eventItemPresenter = new EventItemPresenter({
        listContainer: this.#eventListPresenter.element,
        eventParameters: eventParam,
        formParameters: formParam,
        onDataChange: this.#handleEventItemChange,
        onModeChange: this.#handleModeChange });

      /** тут надо инициализировать вместе с моделью init(tripEvent) */
      eventItemPresenter.init(tripEvent);
      /** сохраняем презентер каждой точки маршрута и её id */
      this.#eventItemPresenters.set(tripEvent.id, eventItemPresenter);
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

  /**
   * обновляем список, если были сделаны изменения в элементе списка
   * НЕ МЕШАЛО БЫ СДЕЛАТЬ ЭТО В КОМПОНЕНТЕ СПИСКА eventListPresenter
   */
  #handleEventItemChange = (updateTripEvent) => {

    this.#tripEventsModel.update(updateTripEvent);
    this.#tripEvents = this.#tripEventsModel.getTripEvents();
    // находим itemPresenter по id и обновляем  его
    this.#eventItemPresenters.get(updateTripEvent.id).init(updateTripEvent);
  };

  #handleModeChange = () => {
    this.#eventItemPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderNoTasks() {

    render(new NoEventsView(), this.#eventContainer);
  }

  init() {
    // this.#tripEvents = this.#tripEventsModel.getTripEvents();
    this.#tripEvents = [];

    if (this.#tripEvents.length < 1) {
      this.#renderNoTasks();
    } else {
      this.#setEventListElement();
      this.#setSortFormElement();

    }
  }

}
