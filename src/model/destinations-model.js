import {destinationPoints} from '../mock/mock-destinations.js'

export default class DestinationsModel {
  #destinations = null;

  constructor() {
    this.#destinations = [...destinationPoints];
    console.log(this.#destinations);
  }

  get destinations () {
    return this.#destinations;
  }
}
