import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import FormView from '../view/edit-form-view.js';
import { RenderPosition } from '../render.js';
import { render } from '../render.js';
import EventItemView from '../view/event-item-view.js';
import EventListItemView from '../view/event-list-item-view.js';

import HeaderPresenter from './header-presenter.js';
import EventContentPresenter from './event-content-presenter.js';

export default class MainPresenter {
  constructor({headerContainer, eventsContainer}) {
    this.headerContainer = headerContainer;
    this.eventsContainer = eventsContainer;
  }

  // renderHeader(eventListLength) {
  //   if (this.headerContainer) {
  //     render(this.filterView, this.headerContainer);
  //   }

  //   if (this.eventsContainer) {
  //     render(this.sortView, this.eventsContainer, RenderPosition.BEFOREEND);

  //     // this.eventListView.addListItems(eventListLength);
  //     // this.eventListView.fillWithElements(eventListLength);
  //     // console.log(this.eventListView);
  //     // console.log(this.eventListView.getElement());
  //     render(this.eventListView, this.eventsContainer);
  //     render(new EventListItemView(), this.eventListView.getElement());
  //     render(this.formView, this.eventListView.getElement().firstElementChild);

  //   }
  // }

  /** создаем фильтр и список событий */
  // init(eventListLength) {


  //     initHeader(this.headerContainer);
  //     initEventContent({});

  //   this.filterView = new FilterView();
  //   // console.log(this.filterView.getElement());
  //   // this.eventItemView = new EventItemView();
  //   this.sortView = new SortView();
  //   this.formView = new FormView();
  //   this.eventListView = new EventListView();
  //   this.renderHeader(eventListLength);
  // }

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
