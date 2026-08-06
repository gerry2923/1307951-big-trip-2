import { createSortTemplate } from './sort-template';
import AbstractView from '../../framework/view/abstract-view';

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  #sortTypeChange = (evt) => {
    // делаем проверку на что мы кликнули. Должен быть тэг A
    if(evt.target.tagName !== 'LABEL' || !evt.target.hasAttribute('data-sort-type')) {
      return;
    }

    evt.preventDefault();
    // нужно передать тип сортировки
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    // поставили обработчик на весь элемент. Для того, чтобы определять, куда был сделан клик, поставили каждому элементу data-атрибут
    this.element.addEventListener('click', this.#sortTypeChange);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

}
