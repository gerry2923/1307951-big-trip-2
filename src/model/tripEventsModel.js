import { getRundomTripEvent, getRundomTripEventArray } from '../mock/mockTripEvent.js';
import { destinationPoints } from '../mock/mockDestination.js';
import { offers } from '../mock/mockOffers.js';
import { NUMBER_OF_TRIP_EVENTS } from '../const.js';
import { updateItem } from '../utils/common.js';


export default class TripEventsModel {

  #tripEvents = null;
  constructor() {
    this.#tripEvents = getRundomTripEventArray(NUMBER_OF_TRIP_EVENTS);
    console.log(this.#tripEvents);
    // this.#tripEvents = Array.from({length: NUMBER_OF_TRIP_EVENTS}, getRundomTripEvent);
  }

  /**
 * @returns {Array} массив из объектов, каждый элемент которого содержит данные о событии поездки
 */
  getTripEvents() {
    return this.#tripEvents;
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

  getDestinationPoint(destId) {
    return destinationPoints.find((item) => item.id === destId);
  }

  update(updateTripEvent) {
    this.#tripEvents = updateItem(this.#tripEvents, updateTripEvent);
  }
}
