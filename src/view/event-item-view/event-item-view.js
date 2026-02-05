import { createEventItemTemplate } from './event-item-template.js';
import AbstractView from '../../framework/view/abstract-view.js';
// import { createElement } from '../../framework/render.js';

export default class EventItemView extends AbstractView{

  /** в конструктор передается объект с данными */
  #eventParam = null;
  #handleOnArrowToggleFrom = null;
  // #element = null;
  constructor({eventParam, onArrowToggleFormClick}) {
    super();
    this.#eventParam = eventParam;
    this.#handleOnArrowToggleFrom = onArrowToggleFormClick;
    this.#initEventListeners();
  }

  get template() {
    return createEventItemTemplate({
      dateFrom: this.#eventParam.dateFrom,
      dateTo: this.#eventParam.dateTo,
      basePrice: this.#eventParam.basePrice,
      type: this.#eventParam.type,
      title: this.#eventParam.title,
      offers: this.#eventParam.offers
    });
  }

  #onHandleArrowClick = (evt) => {
    evt.preventDefault();
    this.#handleOnArrowToggleFrom();
  };

  #initEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('pointerdown', this.#onHandleArrowClick);
  }

}
