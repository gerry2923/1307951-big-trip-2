import FilterView from '../view/filter-view/filter-view';
import { render, replace, remove } from '../framework/render';
import { FilterType, UpdateType } from '../const';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;
  #filtersModel = null;
  #pointsModel = null;
  #areActivePoints = null;

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #checkNoPoints = () => {
    Object.values(FilterType).forEach((filterName) => {
      if(this.#areActivePoints(filterName)){
        this.#filterComponent.disableFilterButton(filterName);
      }
    });
  };

  resetFilter = () => {
    this.#handleFilterTypeChange(FilterType.EVERYTHING);
  };

  constructor({ headerContainer, filtersModel, pointsModel, checkActivPointsNumber}) {
    this.#filterContainer = headerContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    this.#areActivePoints = checkActivPointsNumber;

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
      render(this.#filterComponent, this.#filterContainer,);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy() {
    this.#filtersModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    remove(this.#filterComponent);
  }

  init() {
    this.#renderFilter();
    this.#checkNoPoints();
  }
}
