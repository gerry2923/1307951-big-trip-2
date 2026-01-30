// import EventListItemView from './event-list-item-view.js';
// import {createElement} from '../../render.js';
import {createEditFormTemplate} from '../edit-form-view/edit-form-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EditFormView extends AbstractView{
  #tripEventsModel = null;
  #tripEvent = null;
  constructor ({tripEventsModel, tripEvent}) {
    super();
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvent = tripEvent;

  }

  get template() {
    return createEditFormTemplate(this.#tripEvent, this.#tripEventsModel);
  }

}
