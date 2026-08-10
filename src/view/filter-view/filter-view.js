import AbstractView from '../../framework/view/abstract-view';
import { createFilterTemplate, createDisabledFilterTemplate } from './filter-template';


/**
 * установить событие на клике
 * отрисовать активный фильтр
 */
export default class FilterView extends AbstractView{
  #currentFilter = null;
  #handleFilterClick = null;
  #isDisabled = null;

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

  constructor({currentfitlerType, onfilterTypeChange, isDisabled = false}) {
    super();
    this.#currentFilter = currentfitlerType;
    this.#handleFilterClick = onfilterTypeChange;
    this.#isDisabled = isDisabled;
    this.element.addEventListener('click', this.#filterTypeChange);
  }

  get template() {
    if(this.#isDisabled) {
      return createDisabledFilterTemplate();
    }

    return createFilterTemplate(this.#currentFilter);
  }

}
