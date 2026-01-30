import {createEventListItemTemplate} from '../event-list-item-view/event-list-item-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EventListItemView extends AbstractView{
  get template() {
    return createEventListItemTemplate();
  }
}
