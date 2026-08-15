import AbstractView from '../../framework/view/abstract-view';
import { createFilterTemplate } from './filter-template';


export default class FilterView extends AbstractView{
  #currentFilter = null;
  #handleFilterClick = null;

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

  constructor({currentfitlerType, onfilterTypeChange}) {
    super();
    this.#currentFilter = currentfitlerType;
    this.#handleFilterClick = onfilterTypeChange;
    this.element.addEventListener('click', this.#filterTypeChange);
  }

  get template() {
    return createFilterTemplate(this.#currentFilter);
  }

  disableFilterButton = (filterName) => {
    this.element.querySelector(`#filter-${filterName}`).disabled = true;
  };

}
