import {createElement} from '../render.js';

function createEventListItemTemplate() {
  return (
    '<li class="trip-events__item"></li>'
  );
}

export default class EventListItemView {
  getTemplate() {
    return createEventListItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

}
