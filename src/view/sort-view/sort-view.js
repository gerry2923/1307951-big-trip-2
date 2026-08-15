import { createSortTemplate } from './sort-template';
import AbstractView from '../../framework/view/abstract-view';

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'LABEL' || !evt.target.hasAttribute('data-sort-type')) {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

}
