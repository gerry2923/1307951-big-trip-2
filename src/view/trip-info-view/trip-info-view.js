import AbstractView from '../../framework/view/abstract-view';
import { createTripInfoTemplate } from './trip-info-template';

export default class TripInfoView extends AbstractView {

  #destinationPoints = null;
  #price = null;

  constructor({destinationPoints, price}) {
    super();
    this.#destinationPoints = destinationPoints;
    this.#price = price;
  }

  get template() {
    return createTripInfoTemplate();
  }

}
