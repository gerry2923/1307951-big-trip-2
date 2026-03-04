import { getRundomTripEvent, getRundomTripEventArray } from '../mock/mockTripEvent.js';
import { destinationPoints } from '../mock/mockDestination.js';
import { offers } from '../mock/mockOffers.js';
import { NUMBER_OF_TRIP_EVENTS } from '../const.js';
import { updateItem } from '../utils/common.js';

import Observable from '../framework/observable.js'


export default class TripEventsModel extends Observable{

  #tripEvents = null;
  constructor() {
    super();
    this.#tripEvents = getRundomTripEventArray(NUMBER_OF_TRIP_EVENTS);
    // this.#tripEvents = Array.from({length: NUMBER_OF_TRIP_EVENTS}, getRundomTripEvent);
  }

  /**
 * @returns {Array} массив из объектов, каждый элемент которого содержит данные о событии поездки
 */
  get tripEvents() {
    return this.#tripEvents;
  }

  updateTripEvent(updateType, update) {
    const index = this.#tripEvents.findIndex((task) => task.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    this.#tripEvents = [
      ... this.#tripEvents.slice(0, index),
      update,
      ...this.#tripEvents.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addTripEvent(updateType, update) {
    this.#tripEvents = [
      update,
      ...this.#tripEvents,
    ];

    this._notify(updateType, update);
  }

  deleteTripEvent(updateType, update) {
    const index = this.#tripEvents.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#tripEvents = [
      ...this.#tripEvents.slic(0, index),
      ...this.#tripEvents.slice(index + 1),
    ];

    this._notify(updateType);
  }

  getTripEventsLength() {
    return this.#tripEvents.length;
  }

  getTripTitle(tripEvent) {
    return destinationPoints.find((destinationPoint) => destinationPoint.id === tripEvent.destination).name;
  }

  getTripEventById(tripEventId) {
    return this.#tripEvents.find((tripEvent) => tripEvent.id === tripEventId);
  }

  getOffersByEvent(tripEvent) {
    const offersOfTripEvent = offers.find((offer) => offer.type === tripEvent.type).offers;
    return tripEvent.offers.map((item) => offersOfTripEvent.find((offer) => offer.id === item));
  }

  /** возвращает все предложения/offers одного типа, например taxi или bus  */

  getAllOffersByType(type) {
    return (offers.find((item) => item.type === type)).offers;
  }

  getDestinationPointById(destId) {
    return destinationPoints.find((item) => item.id === destId);
  }

  getDestinationPointByName(destName) {
    return destinationPoints.find((item) => item.name === destName);
  }

  getAllOffers() {
    return offers;
  }

  getAllDestinations() {
    return destinationPoints;
  }

  getDestinationNames() {
    return destinationPoints.map((point) => point.name);
  }

  update(updateTripEvent) {
    this.#tripEvents = updateItem(this.#tripEvents, updateTripEvent);
  }

}
