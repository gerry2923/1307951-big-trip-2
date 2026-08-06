import NewButtonView from '../view/add-point-button-view/add-point-button-view';
import { render } from '../framework/render';

export default class NewButtonPresenter {

  #newButtonComponent = null;
  // #mainPresenter = null;
  // #headerContainer = null; //??
  #buttonContainer = null;
  #handleNewButtonClick = null;

  #newButtonClickHandler = () => {
    // при нажатии на кнопку, мы ее отключаем
    this.#newButtonComponent.element.disabled = true;
    this.#handleNewButtonClick();
  };

  toggleButton = () => {

  };

  handleFormSubmit = () => {
    // если форма с  новыми данными закрылась, то кнопку разблокируем
    this.#newButtonComponent.element.disabled = false;
  };

  constructor ({buttonContainer, onNewButtonClick }) {
    // this.#mainPresenter = mainPresenter;
    this.#buttonContainer = buttonContainer;
    this.#handleNewButtonClick = onNewButtonClick;
  }

  init() {
    this.#newButtonComponent = new NewButtonView({
      onButtonClick: this.#newButtonClickHandler,
    });

    render(this.#newButtonComponent, this.#buttonContainer);
  }

}
