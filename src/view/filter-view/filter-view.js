// import {createElement} from '../../framework/render.js';
import {createFilterTemplate} from '../filter-view/filter-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class FilterView extends AbstractView{
  get template() {
    return createFilterTemplate();
  }

}
