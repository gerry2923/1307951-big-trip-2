import {createElement} from '../render.js';
import EventItemView from './event-item-view.js';
import EventListItemView from './event-list-item-view.js';

function createEventListTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class EventListView {
  constructor ({listContainer, listLength}) {
    this.listContainer = listContainer;
    this.listLength = listLength;
  }

  getTemplate() {
    return createEventListTemplate();
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

  clearElement() {
    this.element.innerHTML = '';
  }

  addListItemBefore() {
    this.getElement().prepend((new EventListItemView()).getElement());
  }


  addListItems() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.listLength; i++) {
      fragment.appendChild((new EventListItemView()).getElement());
    }
    this.getElement().appendChild(fragment);
  }

  fillWithEventItems() {

    Array.from(this.getElement().querySelectorAll('li'), (item) => {
      item.appendChild((new EventItemView()).getElement());
    });

  }

  init() {
    this.addListItems();
    this.fillWithEventItems();
  }
  // addListItems(elementsNumber) {

  //   const fragment = document.createDocumentFragment();
  //   for (let i = 0; i < elementsNumber; i++) {
  //     fragment.appendChild((new EventListItemView()).getElement());
  //   }

  //   return this.getElement().appendChild(fragment);
  // }

  // fillWithElements(elementsNumber) {

  //   const fragment = document.createDocumentFragment();

  //   for (let i = 0; i < 1; i++) {
  //     const eventItem = new EventItemView();
  //     const eventListItem = new EventListItemView();
  //     const eventListElement = eventListItem.getElement();
  //     const eventItemElement = eventItem.getElement();
  //     const finalElement = eventListElement.appendChild(eventItemElement);
  //     console.log(eventListElement);

  //     const eliItem = eventListItem.getElement().appendChild(eventItem.getElement());
  //     // console.log(eliItem);
  //     const listItem = this.getElement()
  //       .appendChild(eventListItem.getElement()
  //         .appendChild(eventItem.getElement()));
  //     // console.log(listItem);
  //     fragment.appendChild(listItem);
  //   }

  //   return this.element.appendChild(fragment);

  // }
}
