import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view/event-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import EditFormView from '../view/edit-form-view/edit-form-view.js';


export default class EventContentPresenter {
  constructor({eventsContainer, tripEventsModel}) {
    this.eventContainer = eventsContainer;
    // this.listLength = listLength;
    this.tripEventsModel = tripEventsModel;

  }

  setListLength (length) {
    this.listLength = length;
  }

  setEventListElement() {
    // this.eventList = new EventListView({ listContainer: this.eventContainer, listLength: this.listLength });
    this.eventList = new EventListView({ listContainer: this.eventContainer, tripEventsModel: this.tripEventsModel });
    render(this.eventList, this.eventContainer);
    this.eventList.init();
  }

  setSortFormElement() {
    this.sortForm = new SortView();

    if (this.eventContainer.childElementCount === 1) {
      this.eventContainer.appendChild(this.sortForm);
    } else if (this.eventContainer.childElementCount > 1) {

      this.eventContainer.insertBefore(this.sortForm.element, this.eventContainer.firstElementChild.nextElementSibling);
    }
  }

  /* Для демонстрации добавляем в форму редактирования первый элемент*/

  setEditFormElement() {
    this.eventList.addListItemBefore();
    /**  создаем форму редактирования по id модели (для примера берем первую модель) index = 0*/
    const index = 0;
    this.editForm = new EditFormView({tripEventsModel:this.tripEventsModel, tripEvent: this.tripEventsModel.getTripEvents()[index]});
    render(this.editForm, this.eventList.element.firstElementChild);
    /** удаляем этот элемент из списка, тк теперь он в форме редактирвания */
    this.eventList.removeOneElementByIndex(index + 1);
  }

  // TODO: добавить объекты событий

  init() {
    this.setEventListElement();
    this.setSortFormElement();
    this.setEditFormElement();
  }

}
