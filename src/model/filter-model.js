import { FilterType } from '../const';
import Observable from '../framework/observable';

export default class FilterModel extends Observable{

  #filter = FilterType.EVERYTHING;

  constructor () {
    super();
  }

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
  }

  setFilter(updateType, filter){
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
