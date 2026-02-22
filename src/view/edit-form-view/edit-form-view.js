import { createEditFormTemplate } from '../edit-form-view/edit-form-template.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import { Russian } from "flatpickr/dist/l10n/ru.js"

// import 'flatpickr/dist/flatpickr.min.css'
import '../../../node_modules/flatpickr/dist/flatpickr.min.css';


export default class EditFormView extends AbstractStatefulView {
  #datepickerFromDate = null;
  #datepickerToDate = null;
  #getAllDestinations = null;
  #tripEvent = null;
  // #formParam = null;
  #handleFormSubmit = null;
  #handleEditClick = null;
  #handleOnEscKeyClick = null;
  #handleTypeChange = null;
  #getDestinationById = null;
  #getDestinationByName = null;
  #destinationObject = null;
  #getAllOffers = null;
  #getTripEventOffer = null;
  #allOffers = null;
  #appliedOffers = null;
  #type = null;

  // проверка доступа к кнопке отправки данных
  #isSubmitDisabled = true;


  constructor({ destinations, tripEvent, /*formParam, */onFormSubmit, onEditClick, onTypeChange, getDestinationById , getDestinationByName, getAllOffers, getTripEventOffers/** onEscKeyClick*/ }) {
    super();
    // нужно для создания списка точек назначения
    this.#getAllDestinations = destinations; // список с названиями точек назначения
    this.#tripEvent = tripEvent;
    // this.#formParam = formParam;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    this.#handleTypeChange = onTypeChange;

    this.#getDestinationById = getDestinationById; // возвращает один целый объект
    this.#getDestinationByName = getDestinationByName;
    this.#getAllOffers = getAllOffers;
    this.#getTripEventOffer = getTripEventOffers;

    this.#destinationObject = this.#getDestinationById(this.#tripEvent.destination);
    // this.#type = this.#tripEvent.type;
    this.#allOffers = this.#getAllOffers(this.#tripEvent.type);
    this.#appliedOffers = this.#getTripEventOffer(this.#tripEvent);
    // метод статический! для него экземпляр не нужен
    this._setState(EditFormView.parseEventToState(tripEvent, this.#destinationObject, this.#allOffers, this.#appliedOffers));
    // this.#handleOnEscKeyClick = onEscKeyClick;
    this._restoreHandlers();
  }


  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('pointerdown', this.#onFormSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('pointerdown', this.#onEditFormClick);
    this.element.querySelector('#event-type-toggle-1').addEventListener('click', this.#onChangeTripEventType);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#onDataListChange);

    this.#setDatepicker();
  }

  get template() {
    return createEditFormTemplate({
      destinationTripPoints: this.#getAllDestinations(),
      tripEvent: this._state,//this.#formParam.eventModel,
      // type: this.#type,
      destination: this.#destinationObject,
      allOffers: this.#allOffers,
      appliedOffers: this.#appliedOffers,
    });
  }

  // замена формы на событие путешествия

  #onEditFormClick = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  // изменение данных и замена формы на событие путешествия
  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#tripEvent = EditFormView.parseStateToEvent(this._state);
    this.#handleFormSubmit(this.#tripEvent);
  };

  // вынести в презентер
  static parseEventToState(tripEvent, destination, allOffers, appliedOffers) {
    return { ...tripEvent,
      destinationObj: destination,
      allOffers: allOffers,
      appliedOffers: appliedOffers,
    };

    // сюда можно добавить новые свойста {... tripEvent,
    // isDueDate: task.dueDate !== null,
    // isRepeating: isTaskRepeating(task.repeating),}
  }

  static parseStateToEvent(state) {
    const tripEvent = { ...state };
    // тут удаляем, добавленные в состояние новые (временные) свойства 'delete task.isDueDate'
    return tripEvent;
  }

  /*---------------- FLATPICKER start --------------------------- */


  #dateFromChangeHandler = (userDate) => {
    this.updateElement({
      dateFrom: userDate,
    })
  };

  #dateToChangeHandler = (userDate) => {
    this.updateElement({
      dateTo: userDate,
    })
  };

  #setDatepicker() {

    this.#datepickerFromDate = flatpickr(
      this.element.querySelector('#event-start-time-1'), {
        // "locale": "ru",
        "locale": Russian,
        enableTime: true,
        dateFormat: 'd/m/y h:i',
        defaultDate: this._state.dateFrom,
        // altInput: true,
        // altFormat: 'F j, Y',
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#datepickerToDate = flatpickr(
      this.element.querySelector('#event-end-time-1'), {
        dateFormat: 'j F',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      }
    );

  }
/** TODO  */
    removeElement() {
      super.removeElement();

      if (this.#datepickerFromDate) {
        this.#datepickerFromDate.destroy();
        this.#datepickerFromDate = null;
      }

      if (this.#datepickerToDate) {
        this.#datepickerToDate.destroy();
        this.#datepickerToDate = null;
      }

  }

  /*---------------- FLATPICKER end ------------------------------ */
  // когда выбрал другой тип путешествия
  #onChangeEventOffers = (evt) => {
    // console.log(evt.target);
    // нашли новое значение типа
    const newTypeValue = evt.target.getAttribute('value');
    // проверить, такое как и было или нет?
    if (this._state.type !== newTypeValue) {
      // ищем все предложения для нового типа (перенести в презентер)
      // const elem = document.querySelector('#event-destination-1');
      // console.log(elem);
    // изменяем тип события
    // 1. перерисовать оферы
    // 2. поменять занчок типа
    // 3. закрыть окно

      // поменятья allOffers и appliedOffers

      this.#allOffers = this.#getAllOffers(newTypeValue);
      // обнуляем применяемые предложения, потому что
      this.#appliedOffers = [];
      this.updateElement({
        type: newTypeValue,
        allOffers: this.#allOffers,
        appliedOffers: this.#appliedOffers,
      });

    }
  };


  #onChangeTripEventType = (evt) => {
    evt.preventDefault();
    const radioButtons = this.element.querySelectorAll('input[name="event-type"]');
    const tripEventTypeLabel = this.element.querySelector('.event__type-list');
    // при нажатии на кнопку значака типа закрываем и открываем выпадающее меню
    tripEventTypeLabel.style.display = (tripEventTypeLabel.style.display) ? '' : 'block';

    // если меню отображено
    if (tripEventTypeLabel.style.display) {
      // навешиваем обработчик на каждый input
      [...radioButtons].forEach((radioButton) => {
        radioButton.addEventListener('change', this.#onChangeEventOffers);

      });
    } else {
      [...radioButtons].forEach((radioButton) => {
        radioButton.removeEventListener('change', this.#onChangeEventOffers);
      });
    }
  };

  // изменяет destination
  #onDataListChange = (evt) => {
    evt.preventDefault();
    this.#destinationObject = this.#getDestinationByName(evt.target.value);
    // console.log(this._state);
    this.updateElement({
      destinationObj: this.#destinationObject,
    });

    this._restoreHandlers();

    // element.setAttribute('value', value);
    console.log(this.element);

    // this._state.destination
    // console.log(evt.target);
    // console.log(evt.target.value);
    // evt.target.setAttribute('value', evt.target.value);
    // console.log(evt.target);
  };

}
