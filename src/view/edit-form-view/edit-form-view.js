import {createEditFormTemplate} from '../edit-form-view/edit-form-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EditFormView extends AbstractView{
  #formParam = null;
  #onEditHandler = null;

  constructor ({formParam, onEditClick}) {
    super();
    this.#formParam = formParam;
    this.#onEditHandler = onEditClick;
    this.#initEventListeners();
  }

  get template() {
    return createEditFormTemplate({
      dateFrom: this.#formParam.dateFrom,
      dateTo: this.#formParam.dateTo,
      basePrice: this.#formParam.basePrice,
      type: this.#formParam.type,
      destination: this.#formParam.destination,
      allOffers: this.#formParam.allOffers,
      appliedOffers: this.#formParam.appliedOffers
    });
  }

  #onEditFormClick = (evt) => {
    evt.preventDefault();
    this.#onEditHandler();
  };

  #initEventListeners() {
    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#onEditFormClick);
    this.element.querySelector('.event__rollup-btn').addEventListener('pointerdown', this.#onEditFormClick);
  }

}
