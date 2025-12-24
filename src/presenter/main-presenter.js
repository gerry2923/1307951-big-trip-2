import HeaderPresenter from './header-presenter.js';
import EventContentPresenter from './event-content-presenter.js';

export default class MainPresenter {
  constructor({headerContainer, eventsContainer}) {
    this.headerContainer = headerContainer;
    this.eventsContainer = eventsContainer;
  }

  init(eventListLength) {
    const header = new HeaderPresenter({headerContainer: this.headerContainer});
    header.init();

    const eventContent = new EventContentPresenter({
      eventsContainer: this.eventsContainer,
      listLength: eventListLength
    });
    eventContent.init();
  }
}
