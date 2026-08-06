import { render, remove } from '../framework/render';
import { FilterTypes, SortTypes, UpdateType, UserAction } from '../const';
import { sortDurationDown, sortPriceDown, sortClosestDayFirst } from '../utils/point';
import { filter } from '../utils/filter';

import SortView from '../view/sort-view/sort-view';
import PointListView from '../view/point-list-view/point-list-view';
import PointListItemView from '../view/point-list-item-view/point-list-item-view';
import PointPresenter from './point-presenter';
import NoPointView from '../view/no-point-view/no-point-view';
import { nanoid } from 'nanoid';

export default class MainPresenter {
  #mainContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #pointListComponent = null;
  #noPointComponent = null; // когда нечему отображаться, нет ни одной точки
  #sortComponent = null;

  #pointPresenters = new Map();
  #pointPresenter = null;
  #newPointPresenter = null;

  #offers = null;
  #destinations = null;
  #selectElementsData = null;
  listItem = null;

  #currentSortType = SortTypes.DAY;
  #filterType = FilterTypes.EVERYTHING;

  #newPointEventHandler = null;

  #printPPIds = () => {
    console.log('-----------');
    this.#pointPresenters.forEach((presenter) => console.log(presenter.presenterId));
    console.log('---  ----  --');
  };

  #removePresenter = (presenter) => {
    this.#pointPresenters.delete(presenter.presenterId);
    this.#pointPresenters.forEach((presenter) => console.log(presenter.presenterId));
  };

  // если нажали на какую-нибудь кнопку при открытой форме редактирования
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter.isNewPoint) {
        presenter.destroy();
        this.#pointPresenters.delete(presenter.presenterId);
        this.this.#printPPIds();
        this.#newPointEventHandler();
      }
      presenter.resetView();
    });
  };

  #handleSortTypeChange = (sortType) => {
    // проверяем, не повторяется ли сортировка
    console.log(sortType);
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    // очищаем список, но сохраняем тип сортировки
    this.clearMainPage(false);
    // сортируем задачи

    // рендерим список заново
    this.init();

  };

  // если что-то  произошло в моделе
  #handleModelPoint = (updateType, data) => {
    console.log(`action type is ${updateType}`);
    switch (updateType) {
      case UpdateType.PATCH:
        // перерисовываем одну отредактированную точку
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        console.log('очистить все точки и перерисовать заново все точки маршрута, сортировка оставется');
        this.clearMainPage(false); // устновим занчениек resetSortType в false
        this.init();
        // !!!!!!!!!!!!!!!!!!!!!!!!!! удалить printPPIds()!!!!!!!!!!!!!
        this.#printPPIds();
        break;
      case UpdateType.MAJOR:
        console.log('очистить все точки, сбросить сортировку');
        this.clearMainPage();
        this.init();
        break;
    }
  };

  // если что-то произошло в представлении
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      /// методы update, add, delete еще не реализованы
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };


  constructor({ mainContainer, filtersModel, pointsModel, offers, destinations, onNewPointChange }) {
    this.#mainContainer = mainContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#newPointEventHandler = onNewPointChange;

    this.#selectElementsData = this.#pointsModel.selectElementsOptions; // объект с типами и городами

    // тут же создать NewPointPresenter, для СОЗДАНИЯ  НОВОЙ ТОЧКИ маршрута
    // ее будем отрисовывать, когда добавим точку маршрута
    // ЭТО ЗАРАНЕЕ СОЗДАВАТЬ НЕ БУДЕМ!!!!!!
    // this.#addNewPointPresenter = new NewPointPresenter({
    //   newPointContainer: this.#pointListComponent,
    //   onDataChange: this.#handleViewAction,
    //   // onDestroy: ,
    // });

    // добавляем подписку на изменение модели. Если что-то изменится, будем вызывать метод handleModelPoint и пререрисовывать части или страницу целиком

    this.#pointsModel.addObserver(this.#handleModelPoint);
    this.#filtersModel.addObserver(this.#handleModelPoint);

    console.log(`current sort type ${this.#currentSortType}`);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;

    const filteredPoints = filter[this.#filterType](points);
    console.log(filteredPoints);

    switch (this.#currentSortType) {
      case SortTypes.PRICE:
        console.log('Price')
        return filteredPoints.sort(sortPriceDown);
      case SortTypes.TIME:
        console.log('Time')
        return filteredPoints.sort(sortDurationDown);
      case SortTypes.DAY:
        console.log('Day')
        return filteredPoints.sort(sortClosestDayFirst);;
    }
    // return filteredPoints;
  }

  // TODO !!!
  createPoint() {
    this.#handleModeChange();

    //  * 1. создать пустой шаблон данных
    const BLANK_POINT = {
      id: nanoid(),
      basePrice: 0,
      dateFrom: '',
      dateTo: '',
      destination: '',
      isFavorite: false,
      offers: [],
      type: 'flight'
    };
    //  * 2. создать презентер пустой точки new PointPresenter()
    //  *    в параметры добавить все для пустой точки
    // a) создали li - элемент и отрисовали его (при открытии формы, он уже должен быть)
    const pointListItemComponent = new PointListItemView();
    render(pointListItemComponent, this.#pointListComponent.element, 'afterbegin');

    // b) создали презентер (В презентере будет создано краткое описание точки и форма)
    this.#newPointPresenter = new PointPresenter({
      pointItemContainer: pointListItemComponent,
      offers: this.#offers,
      destinations: this.#destinations,
      selectsContent: this.#selectElementsData,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onAddNewButtonChange: this.#newPointEventHandler,
      removePresenter: this.#removePresenter,
    });

    this.#newPointPresenter.isNewPoint = true;
    // нужно передать id, чтобы в презентере был презентер с id
    // c) инициировали и отрисовали точку
    // this.#newPointPresenter.init({...BLANK_POINT, ...{id: nanoid()}});
    this.#newPointPresenter.init({ ...BLANK_POINT });

    this.#pointPresenters.set(BLANK_POINT.id, this.#newPointPresenter);

    console.log('создаем новую точку');
  }

  renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });


    render(this.#sortComponent, this.#mainContainer);
  }

  renderList(points) {
    // 1. создаем элемент ul для содержания элементов списка
    this.#pointListComponent = new PointListView();
    render(this.#pointListComponent, this.#mainContainer);

    points.forEach((pointItem) => this.renderPoint(pointItem));
  }

  renderPoint(pointItem) {

    // 3.1. создали элемент li
    const pointListItemComponent = new PointListItemView();
    render(pointListItemComponent, this.#pointListComponent.element);

    // 3.2. создали презентер (В презентере будет создано краткое описание точки и форма)
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
    // 3.3. инициировали и отрисовали точку
    this.#pointPresenter.init(pointItem);

    // 3.4. сохранили точку в карте
    this.#pointPresenters.set(pointItem.id, this.#pointPresenter);
  }

  renderNoPoint() {
    this.#noPointComponent = new NoPointView({ filterType: this.#filtersModel.filter });
    render(this.#noPointComponent, this.#mainContainer);
  }

  /** Основная задача удалить все презентеры, которые привязаны к старым данным */
  clearMainPage(resetSortType = true) {
    console.log(`point presenter size = ${this.#pointPresenters.size}`);
    // удалить презентеры для создания точки маршрута по данным и точки редактирования
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    // удалить все презентеры из сета презентеров
    this.#pointPresenters.clear();

    // удалить презентер создания точки маршрута
    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    // если был создан компонент для случая отстутствия точек маршрута, то его надо тоже удалить. У меня это newPagePresenter. В нем создается и шапка и основная часть.

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    // !!! TODO: настроить систему оповещания при изменении внутренностей, менять значения в шапке
    // поставить тип сортировки в значение по умолчанию
    if (resetSortType) {
      console.log('устанавливаем сортировку на дни');
      this.#currentSortType = SortTypes.DAY;
    }

    console.log('clear main page');
  }

  init() {

    // проверяем, есть ли точки в массиве в принципе, если есть, то рисуем, если нет, то отображаем пустую страницу с сообщением
    const points = this.points;
    // console.log(this.#filtersModel.filter);
    // console.log(`точки ${points} end`);
    const pointsLength = points.length;

    if (pointsLength === 0) {
      this.renderNoPoint();
      return;
    }

    this.renderSort();
    this.renderList(points);
  }
}
