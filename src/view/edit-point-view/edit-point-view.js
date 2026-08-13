import { createEditPointTemplate } from './edit-point-template';
import { getAllOffersByType, getSelectedOffers } from '../../utils/point';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import 'flatpickr/dist/flatpickr.min.css';


export default class EditPointView extends AbstractStatefulView {
  #handleCloseFrom = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #startPicker = null;
  #endPicker = null;
  #additionalOptions = null;
  #isPointNew = false;

  #handleCancelClick = null;
  #handelNewFormSubmit = null;
  #handelAddNewButtonEvent = null;
  #handleFormValidation = null;


  #formSubmitNewPointHandler = async (evt) => {
    evt.preventDefault();

    if (this.#isFormValid()) {
      try {
        await this.#handelNewFormSubmit(EditPointView.parseStateToPoint(this._state));
        this.#handelAddNewButtonEvent();
      } catch (err) { /* empty */ }
    } else {
      this.#handleFormValidation();
    }
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseFrom();
  };

  #formSubmitHandler = async (evt) => {
    evt.preventDefault();

    if (this.#isFormValid()) {
      try {
        await this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
      } catch (error) { /* empty */ }
    } else {
      this.#handleFormValidation();
    }


  };

  #dateFromChangeHandler = ([userDate]) => {
    const dateFromStr = moment.utc(userDate).toISOString();
    this.updateElement({
      dateFrom: dateFromStr,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    const dateToStr = moment.utc(userDate).toISOString();
    this.updateElement({
      dateTo: dateToStr,
    });
  };

  #isFormValid = () => {
    const { destination, dateFrom, dateTo, basePrice, allDestinations } = this._state;

    const isDestination = allDestinations.includes(destination);
    const areDatesSelected = !!dateFrom && !!dateTo;
    const isDatesOrderCorrect = dayjs(dateTo).isAfter(dayjs(dateFrom));
    const priceAsNumber = Number(basePrice);
    const isPrice = Number.isInteger(basePrice) && (priceAsNumber > 0);

    return (
      isDestination &&
      areDatesSelected &&
      isDatesOrderCorrect &&
      isPrice
    );

  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });

  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();
    let inputValue = evt.target.value.trim();

    if (!inputValue || typeof inputValue !== 'string') {
      return;
    }

    inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();

    const cityInTheList = this._state.allDestinations.find((destination) => destination.name === inputValue);

    if (cityInTheList === undefined) {
      evt.target.style.color = 'red';
    } else {
      this.updateElement({
        destination: cityInTheList,
      });
      evt.target.style.color = 'black';

    }

  };

  #changePriceHandler = (evt) => {
    evt.preventDefault();
    const priceValue = Math.abs(parseInt(evt.target.value, 10)) || 0;
    this.updateElement({
      basePrice: priceValue,
    });
  };

  #changeOfferHandler = (evt) => {
    evt.preventDefault();

    const offerId = evt.target.id;
    const allTypeOffers = getAllOffersByType(this.#additionalOptions.allOffers, this._state.type);
    const offerToAdd = allTypeOffers.find((offer) => offer.id === offerId);
    const newOffers = this._state.offers;
    const index = newOffers.findIndex((offer) => offer.id === offerId);

    if (index !== -1) {
      newOffers.splice(index, 1);
    } else {
      if (newOffers.length) {
        newOffers.unshift(offerToAdd);
      } else {
        newOffers.push(offerToAdd);
      }
    }

    this.updateElement({
      offers: newOffers,
    });
  };

  #cancelButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  constructor({
    point,
    additionalOptions,
    isPointNew,
    onCloseFormClick,
    onFormSubmit,
    onDeleteClick,
    onCancelClick,
    onNewFromSubmit,
    onAddNewButtonClick,
    onValidationFail }) {

    super();
    this.#additionalOptions = additionalOptions;
    this.#isPointNew = isPointNew;
    this.#handleCloseFrom = onCloseFormClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCancelClick = onCancelClick;
    this.#handelNewFormSubmit = onNewFromSubmit;
    this.#handelAddNewButtonEvent = onAddNewButtonClick;
    this.#handleFormValidation = onValidationFail;

    this._state = EditPointView.parsePointToState(point, this.#additionalOptions, this.#isPointNew);
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers() {
    if (this.#isPointNew) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelButtonHandler);
      this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitNewPointHandler);

    } else {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteHandler);
      this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);

    }

    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('input', this.#changeDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);

    const offerElement = this.element.querySelector('.event__section--offers');
    if (offerElement) {
      offerElement.addEventListener('change', this.#changeOfferHandler,);
    }
    this.#setDatepicker();
  }


  #setDatepicker() {

    if (this._state.dateFrom && this._state.dateTo) {

      this.#startPicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          utc: true,
          allowInput: false,
          defaultDate: (new Date()).toISOString(),
          dateFormat: 'd/m/y H:i',
          altFormat: 'd/m/y H:i',
          locale: {
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
              longhand: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
            },
            months: {
              shorthand: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
              longhand: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            },
            today: 'Сегодня'
          },

          onChange: this.#dateFromChangeHandler,
        }
      );

      this.#endPicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          utc: true,
          allowInput: false,
          defaultDate: this._state.dateTo,
          allowInvalidPreload: true,
          minDate: this._state.dateFrom,
          maxDate: null,
          dateFormat: 'd/m/y H:i',
          altFormat: 'd/m/y H:i',


          locale: {
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
              longhand: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
            },
            months: {
              shorthand: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
              longhand: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            },
            today: 'Сегодня'
          },
          onChange: this.#dateToChangeHandler,
        }
      );

      this.#startPicker.setDate(this._state.dateFrom);
      this.#endPicker.setDate(this._state.dateTo);

    } else {
      this.#startPicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          utc: true,
          allowInput: false,

          dateFormat: 'd/m/y H:i',
          altFormat: 'd/m/y H:i',

          locale: {
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
              longhand: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
            },
            months: {
              shorthand: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
              longhand: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            },
            today: 'Сегодня'
          },
          onChange: this.#dateFromChangeHandler
        }
      );

      this.#endPicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          utc: true,
          allowInput: false,
          dateFormat: 'd/m/y H:i',
          altFormat: 'd/m/y H:i',

          locale: {
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
              longhand: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
            },
            months: {
              shorthand: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
              longhand: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            },
            today: 'Сегодня'
          },

          onChange: this.#dateToChangeHandler,
        }
      );
    }

  }

  removeElement() {
    super.removeElement();

    if (this.#startPicker) {
      this.#startPicker.destroy();
      this.#startPicker = null;
    }

    if (this.#endPicker) {
      this.#endPicker.destroy();
      this.#endPicker = null;
    }
  }


  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point, this.#additionalOptions)
    );
  }


  static parsePointToState(point, additionalOptions, isPointNew) {

    const appliedOptions = point.offers.length ? getSelectedOffers(additionalOptions.allOffers, point.offers, point.type) : [];
    const fullDescriptionDestination = point.destination !== '' ? additionalOptions.allDestinations.find((destination) => destination.id === point.destination) : '';

    const newPoint = {
      ...point,
      isPointNew: isPointNew, // используем геттер
      isSaving: false,
      isDeleting: false,
      isDisabled: false,
      offers: appliedOptions,
      destination: fullDescriptionDestination,
      ...additionalOptions,
    };

    return newPoint;
  }

  static parseStateToPoint(state) {

    const point = { ...state };

    if (point.offers.length) {
      point.offers = point.offers.map((offer) => offer.id);
    } else {
      point.offers = [];
    }

    point.destination = point.destination.id;


    if (state.isPointNew) {
      delete point.id;
    }

    delete point.allOffers;
    delete point.allDestinations;
    delete point.typesOptions;
    delete point.destinationsOptions;
    delete point.isPointNew;
    delete point.isDeleting;
    delete point.isSaving;
    delete point.isDisabled;

    return point;
  }
}
