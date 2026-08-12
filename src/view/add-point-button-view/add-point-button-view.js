import AbstractView from '../../framework/view/abstract-view';
import { createAddPointButtonTemplate } from './add-point-button-template';

export default class AddPointButtonView extends AbstractView{

  #handleButtonClick = null;
  #isDisabled = false;

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };

  constructor ({onButtonClick}) {
    super();
    this.#handleButtonClick = onButtonClick;
    this._restoreHandlers();
  }

  set isDisabled(isDisabled) {
    this.#isDisabled = isDisabled;
  }

  get isDisabled() {
    return this.#isDisabled;
  }

  get template() {
    return createAddPointButtonTemplate(this.#isDisabled);
  }

  rerenderButton() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

}
