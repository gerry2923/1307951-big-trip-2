import { FilterTypes } from '../const';
import Observable from '../framework/observable';

export default class FilterModel extends Observable{

  #filter = FilterTypes.EVERYTHING;

  constructor () {
    super();
  }

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter){
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
