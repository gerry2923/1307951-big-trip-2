import HeaderPresenter from './header-presenter.js';
import EventContentPresenter from './event-content-presenter.js';

export default class MainPresenter {
  #headerContainer = null;
  #eventsContainer = null;
  #tripEventsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #newEventPresenter = null;

  constructor({headerContainer, eventsContainer, tripEventsModel, offersModel, destinationsModel}) {
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#tripEventsModel = tripEventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#newEventPresenter = new
  }

  init() {
    const header = new HeaderPresenter({
      headerContainer: this.headerContainer,
      tripEventsModel: this.tripEventsModel,
      newEvenPresenter: new
    });

    header.init();

    const eventContent = new EventContentPresenter({
      eventsContainer: this.eventsContainer,
      tripEventsModel: this.tripEventsModel,
    });

    eventContent.init();
  }
}
