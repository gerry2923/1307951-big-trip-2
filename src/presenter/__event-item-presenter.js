import { render, replace, remove } from '../framework/render.js';
import EditFormView from '../view/edit-form-view/edit-form-view.js';
import EventItemView from '../view/event-item-view/event-item-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITITNG'
};

export default class EventItemPresenter {
  #listContainer = null;
  #eventParameters = null;
  #formParameters = null;

  #tripEventComponent = null; // EventItemView
  #tripEventsModel = null;
  #editFormEventComponent = null;
  #tripEvent = null; // dataFromModel
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor ({listContainer, tripEventsModel, tripEvent, eventParameters, /*formParameters,*/ onDataChange, onModeChange}) {
    this.#listContainer = listContainer;
    this.#tripEventsModel = tripEventsModel;
    this.#tripEvent = tripEvent;
    this.#eventParameters = eventParameters;
    // this.#formParameters = formParameters;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  #renderItemEvent () {

    const prevEventComponent = this.#tripEventComponent;
    const prevFormComponent = this.#editFormEventComponent;

    this.#tripEventComponent = new EventItemView({
      tripsModel: this.#tripEventsModel,
      eventParam: this.#eventParameters,
      onArrowDownClick: this.#handleArrowDownClick,
      onFavoriteClick: this.#handleFavouriteClick,
    });

    this.#editFormEventComponent = new EditFormView({
      destinations: this.#getDestinations, // обращение к модели
      tripEvent: this.#tripEvent,
      // formParam: this.#formParameters,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleArrowUpClick,
      onTypeChange: this.#handleChangeTripEventType,
      getDestinationById: this.#getDestinationPointById,
      getDestinationByName: this.#getDestinationPointByName,
      getAllOffers: this.#getAllOffers,
      getTripEventOffers: this.#getTripEventOffers,
    });

    /** Если компонент не создан и он новый, то отрисовываем только что созданный компонент*/
    if (prevEventComponent === null || prevFormComponent === null) {
      render(this.#tripEventComponent, this.#listContainer);
      return;
    }

    /** проверяем, есть ли "старый компонент" на странице,
     * если есть, то заменяем старый на новый, только что созданный
     * тоже самое делаем с компонентом формы
     */

    if(this.#mode === Mode.DEFAULT) {
    // if(this.#listContainer.contains(prevEventComponent.element)) {
      replace(this.#tripEventComponent, prevEventComponent);
    }

    /* МОГУТ ВОЗНИКНУТЬ ОШИБКИ, потому что у меня не отрисованы элементы формы
     * они отрисовываются, когда нажата стрелочка
     * проверка, отрисован ли компонент формы в документе */
    // if(this.#listContainer.contains(this.#editFormEventComponent.element)) {
    if(this.#mode === Mode.EDITING){
      replace(this.#editFormEventComponent, prevFormComponent);
    }

    /** удаляем временные переменные с компонентами формы и события */
    remove(prevEventComponent);
    remove(prevFormComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceFromToEvent();
    }
  }

  #replaceEventToFrom() {
    replace(this.#editFormEventComponent, this.#tripEventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFromToEvent() {

    replace(this.#tripEventComponent, this.#editFormEventComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFromToEvent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleArrowDownClick = () => {
    this.#replaceEventToFrom();
  };
  // изменили значение в одном событии и передали на DataChange

  #handleArrowUpClick = () => {
    this.#replaceFromToEvent();
  };

  #handleFavouriteClick = () => {
    this.#handleDataChange({...this.#tripEvent, isFavorite: !this.#tripEvent.isFavorite});
  };

  #handleFormSubmit = (tripEvent) => {
    this.#handleDataChange(tripEvent);
    this.#replaceFromToEvent();
  };

  destroy() {
    remove(this.#editFormEventComponent);
    remove(this.#tripEventComponent);
  }
  /******************************************************************************* */
  /* для работы с формой */

  #getDestinations = () => this.#tripEventsModel.getDestinationNames();

  #getDestinationPointByName = (name) => this.#tripEventsModel.getDestinationPointByName(name);
  #getDestinationPointById = (id) => this.#tripEventsModel.getDestinationPointById(id);
  #getAllOffers = (type) => this.#tripEventsModel.getAllOffersByType(type);
  #getTripEventOffers = (tripEvent) => this.#tripEventsModel.getOffersByEvent(tripEvent);

  #handleChangeTripEventType = (evt) => {

  };

  init(tripEvent) {
    this.#tripEvent = tripEvent;
    this.#eventParameters.eventModel = tripEvent;
    this.#renderItemEvent();
  }
}
