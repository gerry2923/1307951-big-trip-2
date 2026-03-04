// import {createElement} from '../../framework/render.js';
import {createFilterTemplate} from '../filter-view/filter-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class FilterView extends AbstractView{
  #filters = null; // массив объектов фильтров (всего 4 шт)

  constructor ({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

}
