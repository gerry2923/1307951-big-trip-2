import AbstractView from '../../framework/view/abstract-view';
import { createEmptyPointTemplate } from './no-point-template';

export default class EmptyPointView extends AbstractView{
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointTemplate(this.#filterType);
  }

}
