// import { render, replace} from '../../framework/render.js';
// import EventItemView from '../event-item-view/event-item-view.js';
import { createEventListTemplate } from './event-list-template.js';
import AbstractView from '../../framework/view/abstract-view.js';
// import EditFromView from '../edit-form-view/edit-form-view.js';


export default class EventListView extends AbstractView {


  // constructor () {
  //   super();
  // }

  get template() {
    return createEventListTemplate();
  }

  clearElement() {
    this.element.innerHTML = '';
  }

}
