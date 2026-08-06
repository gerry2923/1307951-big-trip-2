import AbstractView from '../../framework/view/abstract-view';
import { createAddPointButtonTemplate } from './add-point-button-template';

export default class AddPointButtonView extends AbstractView{

  #handleButtonClick = null;

  #buttonClickHandler = (evt) => {
    console.log(evt.target);
    evt.preventDefault();
    console.log(`кнопка заблокирована - ${evt.target.disabled}`);
    // evt.target.disabled = true;
    this.#handleButtonClick();
  };

  constructor ({onButtonClick}) {
    super();
    this.#handleButtonClick = onButtonClick;

    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createAddPointButtonTemplate();
  }

}
