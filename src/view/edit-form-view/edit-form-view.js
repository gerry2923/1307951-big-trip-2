import {createEditFormTemplate} from '../edit-form-view/edit-form-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EditFormView extends AbstractView{
  #tripEvent = null;
  #formParam = null;
  #handleFormSubmit = null;
  #handleEditClick = null;
  #handleOnEscKeyClick = null;

  constructor ({tripEvent,formParam, onFormSubmit, onEditClick/** , onEscKeyClick*/}) {
    super();
    this.#tripEvent = tripEvent;
    this.#formParam = formParam;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    // this.#handleOnEscKeyClick = onEscKeyClick;
    this.#initEventListeners();
  }

  get template() {
    return createEditFormTemplate({
      eventModel: this.#formParam.eventModel,
      destination: this.#formParam.destination,
      allOffers: this.#formParam.allOffers,
      appliedOffers: this.#formParam.appliedOffers
    });
  }
  // замена формы на событие путешествия

  #onEditFormClick = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  // изменение данных и замена формы на событие путешествия
  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#tripEvent);
  };


  // #onEscKeyPress = (evt) => {
  //   this.#handleOnEscKeyClick(evt);
  // };

  #initEventListeners() {
    // this.element.querySelector('.event__save-btn').addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('.event__save-btn').addEventListener('pointerdown', this.#onFormSubmit);

    this.element.querySelector('.event__rollup-btn').addEventListener('pointerdown', this.#onEditFormClick);

    // document.addEventListener('pointerdown', this.#onEscKeyPress);
  }

}
