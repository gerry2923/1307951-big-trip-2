import AbstractView from '../../framework/view/abstract-view';
import { createFilterTemplate } from './filter-template';


/**
 * установить событие на клике
 * отрисовать активный фильтр
 */
export default class FilterView extends AbstractView{
  #currentFilter = null;
  #handleFilterClick = null;

  #filterTypeChange = (evt) => {
    console.log('нажали на фильтры');
    evt.preventDefault();

    if(evt.target.tagName !== 'LABEL') {
      return;
    }

    const input = evt.target.previousElementSibling;

    if (input && input.tagName === 'INPUT') {
      console.log(input.value);
      this.#handleFilterClick(input.value);
    }
  };

  constructor({currentfitlerType, onfilterTypeChange}) {
    super();
    this.#currentFilter = currentfitlerType;
    this.#handleFilterClick = onfilterTypeChange;

    this.element.addEventListener('click', this.#filterTypeChange);
  }

  get template() {
    return createFilterTemplate(this.#currentFilter);
  }

}
