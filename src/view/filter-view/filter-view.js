import AbstractView from '../../framework/view/abstract-view';
import { createFilterTemplate, createDisabledFilterTemplate } from './filter-template';


export default class FilterView extends AbstractView{
  #currentFilter = null;
  #handleFilterClick = null;
  #isDisabled = null;

  #filterTypeChange = (evt) => {
    evt.preventDefault();

    if(evt.target.tagName !== 'LABEL') {
      return;
    }

    const input = evt.target.previousElementSibling;

    if (input && input.tagName === 'INPUT' && !input.hasAttribute('disabled')) {
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


  disableFilterButton() {
    this.element.querySelector('trip-filters__filter-input:checked').setAttribute('disabled', 'true');
  }

}
