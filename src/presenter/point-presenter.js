import { UpdateType, UserAction } from '../const';
import { remove, render, replace } from '../framework/render';
import { isDateEquall } from '../utils/point';

import EditPointView from '../view/edit-point-view/edit-point-view';
import PointView from '../view/point-view/point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {

  #pointContainerComponent = null;
  #editPointComponent = null;
  #pointComponent = null;
  #newPointComponent = null;

  #pointContainer = null;
  #pointData = null;

  #offers = null;
  #destinations = null;
  #destination = null;
  #pointOffers = null;

  #selectDestinationsOptions = null;
  #selectTypeOptions = null;

  #handleDataChange = null;
  #handleModeChange = null;
  #handleNewPointButtonEvent = null;
  #removeFromPresentersSet = null;

  #mode = Mode.DEFAULT;
  #isPointNew = false;

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      console.log('сработала esc');
      evt.preventDefault();

      if(this.#isPointNew) {
        this.#handleCancelClick();
        return;
      }

      this.#editPointComponent.reset(this.#pointData);
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleCloseFrom = () => {
    this.#editPointComponent.reset(this.#pointData);
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavouriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#pointData, isFavorite: !this.#pointData.isFavorite }
    );
  };

  // в update находятся данные точки
  #handelEditFormSubmit = (update) => {
    // обработка отправки формы
    /**
     * нужно проверить, поменялись ли в задаче данные, которые попадают под ФИЛЬТРАЦИЮ, а значит требуют перерисовки списка, если таких нет, то это patch - обновление, т.е. точечное, если поменялось, то уже minor, т.е. с перерисовкой всех данных согласно условию фильтрации
     */

    // console.log(update);
    const isMinorUpdate =
      !isDateEquall(this.#pointData.dateFrom, update.dateFrom) ||
      !isDateEquall(this.#pointData.dateTo, update.dateTo) ||
      !(this.#pointData.basePrice === update.basePrice);
    // console.log('is minor?');
    // console.log(isMinorUpdate);

    // const some = isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH;
    // console.log(some);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  // сохраняем новую точку
  #handelNewFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  // Этот обработчик используется только при создании новой точки
  #handleCancelClick = () => {
    console.log('закрываем форму');
    // удаляем все view и саму точку нового презентера
    this.destroy();
    this.#handleNewPointButtonEvent();
    // удалить из сета всех презентеров
    this.#removeFromPresentersSet(this);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };


  constructor({
    pointItemContainer,
    offers,
    destinations,
    selectsContent,
    onDataChange,
    onModeChange,
    onAddNewButtonChange,
    removePresenter }) {

    this.#pointContainerComponent = pointItemContainer;
    this.#pointContainer = this.#pointContainerComponent.element;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#selectDestinationsOptions = selectsContent.destinationOptions;
    this.#selectTypeOptions = selectsContent.typesOptions;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleNewPointButtonEvent = onAddNewButtonChange;
    this.#removeFromPresentersSet = removePresenter;

  }

  set isNewPoint (isNew) {
    this.#isPointNew = isNew;
  }

  get isNewPoint() {
    return this.#isPointNew;
  }

  get presenterId() {
    return this.#pointData.id;
  }

  #replaceCardToForm() {
    // берем родителя редактируемого компонента и меняем
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    // когда мы хотим поменять карту на форму, мы вызываем обработчик
    // т.е. мы поменяли карту на форму, но еще не изменили режим на editing
    // запустили обработчик handleModeChange. Он бежит по всем презентерам и изменяет только ту форму на карту, которая была отркыта до текущего клика открытия формы
    this.#handleModeChange();
    // только после того, как все презентеры стали со значением режима default, мы изменяем режим у текущей карты в editing
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #extractDataForExistingPoint() {
    //// извлечь объект - город точки назначения
    this.#destination = this.#destinations.find((destinationData) => destinationData.id === this.#pointData.destination);

    //// извлечь все офферы для данного типа

    // 1. массив всех офферов определенного типа
    const allOffersByType = this.#offers.find((offer) => offer.type === this.#pointData.type).offers;
    // 2. массив всех id офферов, которые ЕСТЬ В ТОЧКЕ
    const pointOffersIds = new Set(this.#pointData.offers);

    // 3. массив объектов всех предложений, которые ДОБАВЛЕНЫ В ТОЧКУ
    this.#pointOffers = allOffersByType.filter((offer) => pointOffersIds.has(offer.id));
  }

  // если режим находится в режиме Editing, то заменяем форму на карту
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      // сбрасываем все данные, которые были исправлены. Заменяем их на то, что было
      this.#editPointComponent.reset(this.#pointData);
      // затем заменяем форму на карту
      this.#replaceFormToCard();
    }
  };

  destroy() {
    remove(this.#pointComponent);

    if(this.#editPointComponent) {
      remove(this.#editPointComponent);
    }

    if(this.#newPointComponent) {
      remove(this.#newPointComponent);
    }

    remove(this.#pointContainerComponent);
  }

  renderPoint() {
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#extractDataForExistingPoint();
    // создаем [не полный] компонент точки маршрута списка
    // перерисовка уже СУЩЕСТВУЮЩЕЙ ТОЧКИ
    this.#pointComponent = new PointView({
      point: {
        ...this.#pointData,
        destination: this.#destination.name,
        allOffers: this.#pointOffers, //
      },

      onEditClick: () => {
        this.#replaceCardToForm();
      },

      onFavouriteClick: this.#handleFavouriteClick,
    });


    // создаем компонент точки редактирования
    // добавляем все типы транспорта, города и опцию показа формы
    this.#editPointComponent = new EditPointView({
      point: this.#pointData,
      additionalOptions: {

        allOffers: this.#offers,
        allDestinations: this.#destinations,

        typesOptions: this.#selectTypeOptions,
        destinationsOptions: this.#selectDestinationsOptions,
      },
      isPointNew: this.isNewPoint,
      onCloseFormClick: this.#handleCloseFrom,
      onFormSubmit: this.#handelEditFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCancelClick: this.#handleCancelClick, // изменение состояния кнопки
      onNewFromSubmit: this.#handelNewFormSubmit,
      onAddNewButtonClick: this.#handleNewPointButtonEvent,
    });

    // если инициализировали компонент один раз и точка еще не создана
    // Это нужно, если у нас уже есть выбранные точки, но мы их отрисовываем первый раз на экране
    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointContainer);
      return;
    }
    // заменяем старый компонент формы редактирования prevEditPointComponent на только что созданный, если мы находимся в режиме редактирования
    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    // заменяем старый компонент формы редактирования prevPointComponent на только что созданный, если мы находимся в режиме по умолчанию
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    // отрисовываем только что созданные компоненты
    render(this.#pointComponent, this.#pointContainer);

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  renderNewPoint() {
  /**     this.#pointComponent = new PointView({
      point: {
        ...this.#pointData,
        allOffers: [], // предложения, которые выбрал пользователь
      },

      onEditClick: () => {
        this.#replaceCardToForm();
      },

      onFavouriteClick: this.#handleFavouriteClick,
    });
*/
    // создаем компонент точки редактирования
    // добавляем все типы транспорта, города и опцию показа формы
    this.#newPointComponent = new EditPointView({
      point: this.#pointData,
      additionalOptions: {

        allOffers: this.#offers,
        allDestinations: this.#destinations,

        typesOptions: this.#selectTypeOptions,
        destinationsOptions: this.#selectDestinationsOptions,
      },
      isPointNew: this.isNewPoint,
      onCloseFormClick: this.#handleCloseFrom,
      onFormSubmit: this.#handelEditFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCancelClick: this.#handleCancelClick, // изменение состояния кнопки
      onNewFromSubmit: this.#handelNewFormSubmit,
      onAddNewButtonClick: this.#handleNewPointButtonEvent,
    });

    // поставить в самое первое положение
    render(this.#newPointComponent, this.#pointContainer);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    // this.#mode = Mode.EDITING;
  }

  setSaving() {
    if(this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if(this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if(this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFromState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFromState);
  }


  init(point) {
    // проверяем наличие id. Если есть, то отрисовываем как нормальнгую точк, если нет - то как новую
    this.#pointData = point;
    // this.#isPointNew = this.#pointData.id === '' ? true : false;

    if(this.isNewPoint) {
      this.renderNewPoint();
      return;
    }
    this.renderPoint();
  }
}
