import { createEventItemTemplate } from './event-item-template.js';
import AbstractView from '../../framework/view/abstract-view.js';
// import { createElement } from '../../framework/render.js';

export default class EventItemView extends AbstractView{

  #eventParam = null;
  #handleOnArrowDownClick = null;
  #handleOnFavoriteClick = null;
  #handleOnEscKeyClick = null;
  #tripsModel = null;


  constructor({tripsModel, eventParam, onArrowDownClick, onFavoriteClick/**,onEscKeyClick */}) {
    super();
    this.#tripsModel = tripsModel;
    this.#eventParam = eventParam;
    this.#handleOnArrowDownClick = onArrowDownClick;
    this.#handleOnFavoriteClick = onFavoriteClick;
    this.#initEventListeners();
  }

  get template() {
    return createEventItemTemplate({
      eventModel: this.#eventParam.eventModel,
      title: this.#eventParam.title,
      offers: this.#eventParam.offers
    });
  }

  #onHandleArrowClick = (evt) => {
    evt.preventDefault();
    this.#handleOnArrowDownClick();
  };


  #onFavouriteClick = (evt) => {
    evt.preventDefault();
    this.#handleOnFavoriteClick();
  };

  #initEventListeners() {

    this.element.querySelector('.event__rollup-btn').addEventListener('pointerdown', this.#onHandleArrowClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('pointerdown', this.#onFavouriteClick);
  }

}
