import { render } from '../framework/render.js';
// import SortView from '../view/sort-view/sort-view.js';
import EventListPresenter from './event-list-presenter.js';
import EventItemPresenter from './event-item-presenter.js';
import { updateItem } from '../utils/common.js';
import NoEventsView from '../view/no-events-view/no-events-view.js';
import EventSortPresenter from './event-sort-presenter.js';
import { sortDate } from '../utils/event.js';


export default class EventContentPresenter {
  #eventsContainer = null;
  #tripEventsModel = null;
  #eventListPresenter = null;
  #eventItemPresenters = new Map();
  #eventNoView = null;
  #tripEvents = null;
  #sortPresenter = null;

  constructor({eventsContainer, tripEventsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#tripEventsModel = tripEventsModel;
  }

  #setEventListElement() {
    this.#eventListPresenter = new EventListPresenter({listContainer: this.#eventsContainer});
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

  // очистка коллекции презентеров
  #clearEventTripsList() {

    this.#eventItemPresenters.forEach((presenter) => presenter.destroy());
    this.#eventItemPresenters.clear();
  }

  // замена массива с данными на отсортированный
  #updateTripEvents = (newTripEventsList) => {
    this.#tripEvents = newTripEventsList;
    this.#clearEventTripsList();
    this.#fillListWithEventElements();
  };

  /*TO-DO: ЧТОТО СЮДА ЕЩЕ НАДО ПЕРЕДАТЬ */

  #setSortFormElement() {
    this.#sortPresenter = new EventSortPresenter({
      sortContainer: this.#eventsContainer,
      tasksList: this.#tripEvents,
      renderSortedList: this.#updateTripEvents, // сделать стрелочную функцию
    });
    this.#sortPresenter.init();
  }

  /**
   * обновляем список, если были сделаны изменения в элементе списка
   * НЕ МЕШАЛО БЫ СДЕЛАТЬ ЭТО В КОМПОНЕНТЕ СПИСКА eventListPresenter
   */
  #handleEventItemChange = (updateTripEvent) => {
    // обновили модель
    this.#tripEventsModel.update(updateTripEvent);
    // забрали обновленную модель в свойство/массив
    this.#tripEvents = this.#tripEventsModel.getTripEvents();
    // если изменился какой-то элемент массива с точками путешествия, то его обновляем и во временном массиве у сортировки
    // обновляем значения, но не последовательность
    this.#sortPresenter.sourcedTrips = updateItem(this.#sortPresenter.sourcedTrips, updateTripEvent);
    // находим itemPresenter по id и обновляем  его
    this.#eventItemPresenters.get(updateTripEvent.id).init(updateTripEvent);

  };

  #handleModeChange = () => {
    this.#eventItemPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderNoTasks() {

    render(new NoEventsView(), this.#eventsContainer);
  }

  init() {
    this.#tripEvents = this.#tripEventsModel.getTripEvents();
    // this.#tripEvents = [];

    if (this.#tripEvents.length < 1) {
      this.#renderNoTasks();
    } else {

      this.#tripEvents.sort(sortDate);

      this.#setEventListElement();
      this.#setSortFormElement();

    }
  }

}
