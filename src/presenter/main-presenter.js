import UiBlocker from '../framework/ui-blocker/ui-blocker';
import SortView from '../view/sort-view/sort-view';
import PointListView from '../view/point-list-view/point-list-view';
import PointListItemView from '../view/point-list-item-view/point-list-item-view';
import PointPresenter from './point-presenter';
import NoPointView from '../view/no-point-view/no-point-view';
import LoadingView from '../view/loading-view/loading-view';
import ErrorView from '../view/error-view/error-view';

import { render, remove } from '../framework/render';
import { FilterTypes, SortTypes, UpdateType, UserAction } from '../const';
import { sortDurationDown, sortPriceDown, sortClosestDayFirst } from '../utils/point';
import { filter } from '../utils/filter';


const BLANK_POINT = {
  id: 'blank',
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MainPresenter {
  #mainContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #pointListComponent = null;
  #noPointComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();

  #pointPresenters = new Map();
  #pointPresenter = null;
  #newPointPresenter = null;

  #offers = null;
  #destinations = null;
  #selectElementsData = null;
  listItem = null;

  #currentSortType = SortTypes.DAY;
  #filterType = FilterTypes.EVERYTHING;

  #isLoading = true;
  #isError = false;
  #newPointEventHandler = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });


  #removePresenter = (presenter) => {
    this.#pointPresenters.delete(presenter.presenterId);

  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter.isNewPoint) {
        presenter.destroy();
        this.#pointPresenters.delete(presenter.presenterId);
        this.#newPointEventHandler();
        return;
      }
      presenter.resetView();
    });
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.clearMainPage(false);
    this.init();
  };

  #filterResetHandler = (filterType) => {
    this.#filtersModel.setFilter(UpdateType.MINOR, filterType);
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this.clearMainPage(false);
        this.init();
        break;

      case UpdateType.MAJOR:
        this.clearMainPage();
        this.init();
        break;

      case UpdateType.INIT:
        remove(this.#loadingComponent);
        this.#isLoading = false;

        this.#offers = this.#pointsModel.offers;
        this.#destinations = this.#pointsModel.destinations;
        this.#selectElementsData = this.#pointsModel.selectElementsOptions;

        this.init();
        break;

      case UpdateType.ERROR:
        this.clearMainPage();
        this.#isError = true;
        this.init();
    }
  };


  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {

      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
          this.#uiBlocker.unblock();
          // throw new Error();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
          this.#uiBlocker.unblock();
          // throw new Error();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
          this.#uiBlocker.unblock();
          // throw new Error();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };


  constructor({ mainContainer, filtersModel, pointsModel, offers, destinations, onNewPointChange, }) {
    this.#mainContainer = mainContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#newPointEventHandler = onNewPointChange;

    this.#pointsModel.addObserver(this.#handleModelPoint);
    this.#filtersModel.addObserver(this.#handleModelPoint);
  }

  // eslint-disable-next-line getter-return
  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);


    switch (this.#currentSortType) {
      case SortTypes.PRICE:
        return filteredPoints.sort(sortPriceDown);
      case SortTypes.TIME:
        return filteredPoints.sort(sortDurationDown);
      case SortTypes.DAY:
        return filteredPoints.sort(sortClosestDayFirst);
    }
  }

  createPoint() {
    if(this.#pointPresenters.size) {
      this.#handleModeChange();
    }

    if (this.points.length === 0) {
      remove(this.#noPointComponent);

      this.#pointListComponent = new PointListView();
      render(this.#pointListComponent, this.#mainContainer);
    }

    const pointListItemComponent = new PointListItemView();
    render(pointListItemComponent, this.#pointListComponent.element, 'afterbegin');

    this.#newPointPresenter = new PointPresenter({
      pointItemContainer: pointListItemComponent,
      offers: this.#offers,
      destinations: this.#destinations,
      selectsContent: this.#selectElementsData,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onAddNewButtonChange: this.#newPointEventHandler,
      removePresenter: this.#removePresenter,
      onFilterReset: this.#filterResetHandler,
    });

    this.#newPointPresenter.isNewPoint = true;
    this.#newPointPresenter.init({ ...BLANK_POINT });
    this.#pointPresenters.set(BLANK_POINT.id, this.#newPointPresenter);
  }

  renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });


    render(this.#sortComponent, this.#mainContainer);
  }

  renderList(points) {
    if (this.#pointListComponent === null || !!this.#pointListComponent.element) {
      this.#pointListComponent = new PointListView();
      render(this.#pointListComponent, this.#mainContainer);
    }

    points.forEach((pointItem) => this.renderPoint(pointItem));
  }

  renderPoint(pointItem) {
    const pointListItemComponent = new PointListItemView();
    render(pointListItemComponent, this.#pointListComponent.element);

    this.#pointPresenter = new PointPresenter({
      pointItemContainer: pointListItemComponent,
      offers: this.#offers,
      destinations: this.#destinations,
      selectsContent: this.#selectElementsData,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onNewPointStateChange: this.#newPointEventHandler,
      removePresenter: this.#removePresenter,
    });

    this.#pointPresenter.init(pointItem);
    this.#pointPresenters.set(pointItem.id, this.#pointPresenter);
  }

  renderNoPoint() {
    this.#noPointComponent = new NoPointView({ filterType: this.#filtersModel.filter });
    render(this.#noPointComponent, this.#mainContainer);

  }

  clearMainPage(resetSortType = true) {
    this.#isLoading = false;
    this.#isError = false;
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    remove(this.#loadingComponent);
    remove(this.#errorComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }

    this.#newPointEventHandler();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer);
  }

  #renderFailLoading() {
    render(this.#errorComponent, this.#mainContainer);
  }

  init() {
    if (this.#isError) {
      this.#renderFailLoading();
      return;
    }

    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    if (points.length === 0) {
      this.renderNoPoint();
      return;
    }
    this.renderSort();
    this.renderList(points);

  }
}
