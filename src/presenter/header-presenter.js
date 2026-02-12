import { render } from '../framework/render.js';
import FilterView from '../view/filter-view/filter-view.js';
import { generateFilter } from '../mock/filter.js';

export default class HeaderPresenter {
  #tripEvents = null;
  #filters = null;

  constructor({headerContainer}) {
    this.headerContainer = headerContainer;
  }

  /**
 *  Добавить кнопку
 * @param {object} tripEventsModel
 */

  init(tripEventsModel) {
    this.#tripEvents = [...tripEventsModel.getTripEvents()];
    // создает массив фильтров , который содержит подмассивы с названием типа фильтра и числом событий путешествия, которые соответствуют условиям фильтра
    const filters = generateFilter(this.#tripEvents);
    render(new FilterView({filters}), this.headerContainer);
  }
}
