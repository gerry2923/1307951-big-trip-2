import AbstractView from '../../framework/view/abstract-view';
import { createTripInfoTemplate } from './trip-info-template';

export default class TripInfoView extends AbstractView {

  #destinatioinRoute = null;
  #price = null;
  #tripDuration = null;

  constructor({destinationNames, price, tripDuration}) {
    super();
    this.#price = price;
    this.#tripDuration = tripDuration;
    this.#createDestinationRoute(destinationNames);

  }

  #createDestinationRoute = (cities) => {

    switch(cities.length){
      case(1):
        this.#destinatioinRoute = cities[0];
        break;
      case(2):
        this.#destinatioinRoute = `${cities[0]}&mdash;${cities[1]}`;
        break;
      case(3):
        this.#destinatioinRoute = `${cities[0]}&mdash;${cities[1]}&mdash;${cities[2]}`;
        break;
      default:
        this.#destinatioinRoute = `${cities[0]}&nbsp;&mdash;&nbsp;&hellip;&nbsp;&mdash;&nbsp;${cities[cities.length - 1]}`;
        break;
    }

  };


  get template() {
    return createTripInfoTemplate(this.#destinatioinRoute, this.#price, this.#tripDuration);
  }

}
