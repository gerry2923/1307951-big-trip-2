import HeaderPresenter from './header-presenter';
import MainPresenter from './main-presenter';

export default class PagePresenter {
  #headerContainer = null;
  #mainContainer = null;
  #headerPresenter = null;
  #mainContentPresenter = null;
  #filtersModel = null;
  #pointsModel = null;
  #offers = null;
  #destinations = null;


  #addPointButtonClickHandler = () => {
    this.#mainContentPresenter.createPoint();
  };

  #handleNewPointChange = () => {
    this.#headerPresenter.enableNewPointButton();
  };

  #handleTripInfoCnange = () => {
    this.#headerPresenter.renderTripInfo();
  };

  constructor({ headerContainer, mainContainer, filtersModel, pointsModel,}) {

    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

  }

  enableHeader() {
    this.#headerPresenter.enableHeader();
  }

  #renderPage() {

    this.#pointsModel.init();


    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;


    this.#mainContentPresenter = new MainPresenter({
      mainContainer: this.#mainContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
      onNewPointChange: this.#handleNewPointChange,
      onTripInfoChange: this.#handleTripInfoCnange,
    });

    this.#headerPresenter = new HeaderPresenter({
      pointsModel: this.#pointsModel,
      filtersModel: this.#filtersModel,
      headerContainer: this.#headerContainer,
      onAddPointButtonClick: this.#addPointButtonClickHandler,
    });

    this.#headerPresenter.init();
    this.#mainContentPresenter.init();
  }

  init() {
    this.#renderPage();

  }
}
