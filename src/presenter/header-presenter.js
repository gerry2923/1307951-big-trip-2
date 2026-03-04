import { render } from '../framework/render.js';
import FilterView from '../view/filter-view/filter-view.js';
import { generateFilter } from '../mock/filter.js';

export default class HeaderPresenter {
  #filters = null;
  #tripEventsModel = null;
// тут модель нужна для сортировки и отображения полного путешествия с ценой
  constructor({headerContainer, tripEventsModel}) {
    this.headerContainer = headerContainer;
    this.#tripEventsModel = tripEventsModel;
  }
// есть и в eventContentPresenter и тут

  get tripEvents () {
    return this.#tripEventsModel.tripEvents;
  }

  /**
 *  Добавить кнопку
 * @param {object} tripEventsModel
 */

  init() {
    // создает массив фильтров , который содержит подмассивы с названием типа фильтра и числом событий путешествия, которые соответствуют условиям фильтра
    const filters = generateFilter(this.tripEvents);
    render(new FilterView({filters}), this.headerContainer);
  }
}
