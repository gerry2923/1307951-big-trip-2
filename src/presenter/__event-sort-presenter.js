import { SortType } from '../const.js';
import { render } from '../framework/render.js';
import SortView from '../view/sort-view/sort-view.js';
import { sortTime, sortPrice } from '../utils/event.js';

/* Этот класс создает объект SortPresenter, который производит манипуляции с сортировкой*/
export default class EventSortPresenter {
  #sortContainer = null;
  #tasksList = null;
  #sortForm = null;
  #currentSortType = SortType.DAY;
  // тут будем хранить задачи, которые были созданы в  начальном порядке
  #sourcedEventTrips = [];
  #renderSortedList = null;


  constructor({sortContainer, tasksList, renderSortedList}) {
    this.#sortContainer = sortContainer;
    // сюда передать ссылку на список элементов для сортировки, а не то, что есть сейчас
    this.#tasksList = tasksList;
    this.#sourcedEventTrips = [...tasksList];
    this.#renderSortedList = renderSortedList;

  }

  get sourcedTrips() {
    return this.#sourcedEventTrips;
  }
  /* надо ли?*/

  set sourcedTrips (newEventTrips) {
    // console.log('обновляем временный массив событий');
    this.#sourcedEventTrips = [... newEventTrips];
  }

  #renderEventTripsList = () => {
    this.#renderSortedList(this.#tasksList);
  };
  /** поменяли this.#tasksList */

  #sortEventTrip(choosenSortType) {
    switch (choosenSortType) {
      case SortType.PRICE:
        this.#tasksList.sort(sortPrice);
        break;
      case SortType.TIME:
        this.#tasksList.sort(sortTime);
        break;
      default:
        this.#tasksList = [...this.#sourcedEventTrips];
    }

    this.#currentSortType = choosenSortType;
  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEventTrip(sortType);
    this.#renderEventTripsList();
  };

  #renderSortMenu() {
    this.#sortForm = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    if (this.#sortContainer.childElementCount === 1 || this.#sortContainer.childElementCount === 0) {
      render(this.#sortForm, this.#sortContainer);
    } else if (this.#sortContainer.childElementCount > 1) {
      this.#sortContainer.insertBefore(this.#sortForm.element, this.#sortContainer.firstElementChild.nextElementSibling);
    }

  }

  init() {
    this.#renderSortMenu();
  }
}
