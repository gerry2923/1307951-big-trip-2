import { offers } from '../mock/mock-offers.js';

export default class OffersModel {
  #offers = null;

  constructor() {
    this.#offers = [...offers];

    console.log(this.#offers);
  }

  get offers() {
    return this.#offers
  }

}
