import { FilterType } from '../const.js';
import Observable from '../framework/observable.js';

export default class FilterModel extends Observable{
  // устанавливаем значение фильтра по умолчанию, т.е. полный список точек маршрута
  #filter = FilterType.EVERYTHING;

  // получаем фильтр обратно
  get filter() {
    return this.#filter;
  }

  // если была нажата определенная кнопка фильтра, то фильтр переустанавливается
  setFilter (updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

}
