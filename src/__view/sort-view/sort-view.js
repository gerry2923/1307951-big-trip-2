// import {createElement} from '../../framework/render.js';
import { createSortTemplate } from './sort-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  // #isChecked = false;
  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('pointerdown', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate();
  }

  #changeActiveMenuOptionState(activeItemId) {
    const sortForm = document.querySelector('.trip-events__trip-sort');
    const inputItemsList = Array.from(sortForm.querySelectorAll('.trip-sort__input'));
    inputItemsList.forEach((item) => item.id === activeItemId ? item.setAttribute('checked', true) : item.removeAttribute('checked'));
  }

  #sortTypeChangeHandler = (evt) => {

    if(evt.target.closest('trip-sort__item')) {
      if (!(evt.target.previousElementSibling.tagName === 'INPUT' && evt.target.previousElementSibling.classList.contains('trip-sort__input'))) {
        return;
      }
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.previousElementSibling.dataset.sortType);
    this.#changeActiveMenuOptionState(evt.target.previousElementSibling.id);
  };
}
