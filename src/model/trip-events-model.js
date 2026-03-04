import { getRundomTripEventArray } from '../mock/mock-trip-events.js';
import { NUMBER_OF_TRIP_EVENTS } from '../const.js';
import Observable from '../framework/observable.js'


export default class TripEventsModel extends Observable {

  // массив с данными на стороне клиента
  #tripEvents = null;

  constructor() {
    super();
    // В будущем: сюда мы закинем данные с сервера.
    // this.#tripEvents - массив с объектами событий
    this.#tripEvents = getRundomTripEventArray(NUMBER_OF_TRIP_EVENTS);
    // this.#tripEvents = Array.from({length: NUMBER_OF_TRIP_EVENTS}, getRundomTripEvent);
  }

  /**
 * @returns {Array} массив из объектов, каждый элемент которого содержит данные о событии поездки
 */
  get tripEvents() {
    return this.#tripEvents;
  }

  updateTripEvent(updateType, updateEvent) {
    const index = this.#tripEvents.findIndex((tripEvenet) => tripEvenet.id === updateEvent.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    this.#tripEvents = [
      ... this.#tripEvents.slice(0, index),
      update,
      ...this.#tripEvents.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addTripEvent(updateType, updateEvent) {
    this.#tripEvents = [
      updateEvent,
      ...this.#tripEvents,
    ];

    this._notify(updateType, updateEvent);
  }

  deleteTripEvent(updateType, updateEvent) {
    const index = this.#tripEvents.findIndex((tripEvent) => tripEvent.id === updateEvent.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#tripEvents = [
      ...this.#tripEvents.slic(0, index),
      ...this.#tripEvents.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(tripEvent) {

  }

}
