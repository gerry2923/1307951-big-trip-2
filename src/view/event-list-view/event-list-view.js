import {render, RenderPosition} from '../../framework/render.js';
import EventItemView from '../event-item-view/event-item-view.js';
import EventListItemView from '../event-list-item-view/event-list-item-view.js';
import { createEventListTemplate } from './event-list-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EventListView extends AbstractView{
  #listContainer = null;
  #tripEventsModel = null;
  constructor ({listContainer, tripEventsModel}) {
    super();
    this.#listContainer = listContainer;
    this.#tripEventsModel = tripEventsModel;
  }

  get template() {
    return createEventListTemplate();
  }


  removeOneElementByIndex(index) {
    document.querySelector(`li:nth-child(${index + 1})`).remove();
  }

  clearElement() {
    this.element.innerHTML = '';
  }

  addListItemBefore() {
    render(new EventListItemView(), this.element, RenderPosition.AFTERBEGIN);
  }

  /**
 * добавляет оболочку каждому событию, состоящую из li
 */
  addListItems() {
    const fragment = document.createDocumentFragment();
    const dataLength = this.#tripEventsModel.getTripEventsLength();
    for (let i = 0; i < dataLength; i++) {
      fragment.appendChild((new EventListItemView()).element);
    }

    this.element.appendChild(fragment);
  }

  /**
   * добавляет внутрь каждого li div с калссом 'event'
   */
  fillWithEventItems() {
    const dataLength = this.#tripEventsModel.getTripEventsLength();
    const eventsData = this.#tripEventsModel.getTripEvents();
    /** взяли массив из уже добавленных li */
    const tripEvents = Array.from(this.element.querySelectorAll('li'));

    for (let i = 0; i < dataLength; i++) {

      render((new EventItemView({tripEventsModel : this.#tripEventsModel, tripEventId : eventsData[i].id})), tripEvents[i]);
    }

  }

  init() {
    this.addListItems();
    this.fillWithEventItems();
  }
}
