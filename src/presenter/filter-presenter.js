import FilterView from '../view/filter-view/filter-view';
import { render, replace, remove } from '../framework/render';
import { UpdateType } from '../const';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;
  #filtersModel = null;
  #pointsModel = null;

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if(this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };

  constructor({ headerContainer, filtersModel, pointsModel}) {
    this.#filterContainer = headerContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  #renderFilter() {

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      currentfitlerType: this.#filtersModel.filter,
      onfilterTypeChange: this.#handleFilterTypeChange,
    });

    if(prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }


  destroy() {
    remove(this.#filterComponent);
  }

  init() {
    this.#renderFilter();
  }
}
