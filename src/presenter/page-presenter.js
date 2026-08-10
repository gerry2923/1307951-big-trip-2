// import { FilterTypes } from '../const';
// import EmptyPagePresenter from './_empty-page-presenter';
import HeaderPresenter from './header-presenter';
import MainPresenter from './main-presenter';
// import NewButtonPresenter from './_new-button-presenter';

/**
 * Этот презентер будет связывать шапку и основную часть
 */
export default class PagePresenter {
  #headerContainer = null;
  #mainContainer = null;
  #headerPresenter = null;
  #mainContentPresenter = null;
  #filtersModel = null;
  #pointsModel = null;
  #offers = null;
  #destinations = null;


  // создаем пустую точку
  // новая точка уже деактивирована
  #addPointButtonClickHandler = () => {
    this.#headerPresenter.toggleAddPointButtonState();
    this.#mainContentPresenter.createPoint();
  };

  #handleNewPointChange = () => {
    this.#headerPresenter.toggleAddPointButtonState();
  };

  #handleTripInfoCnange = () => {
    this.#headerPresenter.renderTripInfo();
  };

  constructor({ headerContainer, mainContainer, filtersModel, pointsModel,/*offers, destinations*/ }) {

    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    // this.#offers = offers;
    // this.#destinations = destinations;

  }

  enableHeader() {
    this.#headerPresenter.enableHeader();
  }

  #renderPage() {

    this.#pointsModel.init();


    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;


    // this.#pointsModel.init().finally();
    this.#mainContentPresenter = new MainPresenter({
      mainContainer: this.#mainContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
      // offers: this.#offers,
      // destinations: this.#destinations,
      onNewPointChange: this.#handleNewPointChange,
      onTripInfoChange: this.#handleTripInfoCnange,

    });

    // this.#newButtonPresenter = new NewButtonPresenter({
    //   buttonContainer: this.#headerContainer,
    //   onNewButtonClick: this.#handleNewbuttonClick,
    // });

    this.#headerPresenter = new HeaderPresenter({
      pointsModel: this.#pointsModel,
      filtersModel: this.#filtersModel,
      // destinations: this.#destinations,
      headerContainer: this.#headerContainer,
      // newButtonPresenter: this.#newButtonPresenter,
      onAddPointButtonClick: this.#addPointButtonClickHandler,
    });

    this.#headerPresenter.init();
    this.#mainContentPresenter.init();
  }

  init() {
    this.#renderPage();

  }
}
