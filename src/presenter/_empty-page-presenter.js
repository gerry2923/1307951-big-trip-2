import { render } from '../framework/render';
import NewButtonView from '../view/add-point-button-view/add-point-button-view';
import EmptyPointView from '../view/no-point-view/no-point-view';
import FilterPresenter from './filter-presenter';


/** Этот презентер загружает шапку и страницу если данных нет*/
export default class EmptyPagePresenter {

  #headerContainer = null;
  #mainContainer = null;
  #filterPresenter = null;
  #newButtonView = null;
  #emptyMain = null;
  #filterType = null;

  constructor({ headerContainer, mainContainer, filterType}) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#filterType = filterType;

    console.log('ruru');
  }

  // новые точки еще не заданы, поэтому нет заголовка с точками маршрута
  renderNoTripInfoHeader() {
    // throw new Error('нет ни одной добавленной точки');

    // this.#filterView = new FilterView();
    // render(this.#filterView, this.#headerContainer);

    this.#filterPresenter = new FilterPresenter({headerContainer: this.#headerContainer, isListEmpty: true});
    this.#filterPresenter.init();

    this.#newButtonView = new NewButtonView();
    render(this.#newButtonView, this.#headerContainer);
  }

  // полностью не активные кнопки всей страницы
  renderDisabledHeader() {
    throw new Error('данные загружаются');
  }

  // неактивная кнопка добавления новой точки
  setDisabledNewPointHeader() {
    throw new Error('произошла какая-то ошибка при загрузке');
  }

  renderMain() {
    // this.#message заменить на filtertype
    this.#emptyMain = new EmptyPointView(this.#filterType);
    render(this.#emptyMain, this.#mainContainer);
  }

  init() {
    this.renderNoTripInfoHeader();
    this.renderMain();
  }

}
