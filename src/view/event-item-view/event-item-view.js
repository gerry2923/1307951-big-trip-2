import { createEventItemTemplate } from './event-item-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EventItemView extends AbstractView{
  #tripEventsModel = null;
  #tripEvent = null;
  /** в конструктор передается объект с данными */
  constructor({tripEventsModel, tripEventId}) {
    super();
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvent = this.#tripEventsModel.getTripEventById(tripEventId);
  }

  get template() {
    return createEventItemTemplate(this.#tripEvent, this.#tripEventsModel);
  }


}
