import { createEventItemTemplate } from './event-item-template.js';
import AbstractView from '../../framework/view/abstract-view.js';
// import { createElement } from '../../framework/render.js';

export default class EventItemView extends AbstractView{

  /** в конструктор передается объект с данными */
  #eventParam = null;
  #handleOnClick = null;
  // #element = null;
  constructor({eventParam, onClick}) {
    super();
    this.#eventParam = eventParam;
    this.#handleOnClick = onClick;
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

  #onHandleClick = (evt) => {
    evt.preventDefault();
    this.#handleOnClick();
  };

  #initEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('pointerdown', this.#onHandleClick);
  }

}
