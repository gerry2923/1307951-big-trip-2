import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view/event-list-view.js';

export default class EventListPresenter {
  #listContainer = null;
  #listView = null;
  constructor({listContainer}) {
    this.#listContainer = listContainer;
  }

  #renderList() {
    this.#listView = new EventListView();
    render(this.#listView, this.#listContainer);
  }

  get element() {
    return this.#listView.element;
  }

  init() {
    this.#renderList();

  }
}
