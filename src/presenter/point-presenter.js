import EditPointView from '../view/edit-point-view/edit-point-view';
import PointView from '../view/point-view/point-view';

import { FilterTypes, UpdateType, UserAction } from '../const';
import { remove, render, replace } from '../framework/render';
import { isDateEquall } from '../utils/point';


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
  #handleFilterReset = null;
  #handleNewPointButtonEvent = null;
  #removeFromPresentersSet = null;

  #mode = Mode.DEFAULT;
  #isPointNew = false;


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
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

  #handleFavouriteClick = async () => {
    try {
      await this.#handleDataChange(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        { ...this.#pointData, isFavorite: !this.#pointData.isFavorite }
      );
    } catch (err) { /* empty */ }

  };

  #handelEditFormSubmit = async (update) => {
    try {
      const isMinorUpdate =
        !isDateEquall(this.#pointData.dateFrom, update.dateFrom) ||
        !isDateEquall(this.#pointData.dateTo, update.dateTo) ||
        !(this.#pointData.basePrice === update.basePrice);

      await this.#handleDataChange(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
      );
      this.#replaceFormToCard();
    } catch (err) {/**empty */}
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handelNewFormSubmit = async (point) => {
    try {
      await this.#handleDataChange(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point,
      );
      this.#handleFilterReset(FilterTypes.EVERYTHING);
      this.#handleNewPointButtonEvent();
    } catch (err) {
      throw new Error();
    }

  };

  #handleCancelClick = () => {
    this.destroy();
    this.#handleNewPointButtonEvent();
    this.#removeFromPresentersSet(this);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleValidationFailure = () => {
    this.setAborting();
  };


  constructor({
    pointItemContainer,
    offers,
    destinations,
    selectsContent,
    onDataChange,
    onModeChange,
    onAddNewButtonChange,
    removePresenter,
    onFilterReset }) {

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
    this.#handleFilterReset = onFilterReset;

  }

  set isNewPoint (isNew) {
    this.#isPointNew = isNew;
    if (isNew) {
      this.#mode = Mode.EDITING;
    }
  }

  get isNewPoint() {
    return this.#isPointNew;
  }

  get presenterId() {
    return this.#pointData.id;
  }

  isModeDefault() {
    return this.#mode === Mode.DEFAULT;
  }

  #replaceCardToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #extractDataForExistingPoint() {
    this.#destination = this.#destinations.find((destinationData) => destinationData.id === this.#pointData.destination);

    const allOffersByType = this.#offers.find((offer) => offer.type === this.#pointData.type).offers;
    const pointOffersIds = new Set(this.#pointData.offers);

    this.#pointOffers = allOffersByType.filter((offer) => pointOffersIds.has(offer.id));
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#pointData);
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

    this.#pointComponent = new PointView({
      point: {
        ...this.#pointData,
        destination: this.#destination.name,
        allOffers: this.#pointOffers,
      },

      onEditClick: () => {
        this.#replaceCardToForm();
      },

      onFavouriteClick: this.#handleFavouriteClick,
    });


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
      onCancelClick: this.#handleCancelClick,
      onNewFromSubmit: this.#handelNewFormSubmit,
      onAddNewButtonClick: this.#handleNewPointButtonEvent,
      onValidationFail: this.#handleValidationFailure,
    });


    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointContainer);
      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    render(this.#pointComponent, this.#pointContainer);

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  renderNewPoint() {

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
      onCancelClick: this.#handleCancelClick,
      onNewFromSubmit: this.#handelNewFormSubmit,
      onAddNewButtonClick: this.#handleNewPointButtonEvent,
      onValidationFail: this.#handleValidationFailure,
    });

    render(this.#newPointComponent, this.#pointContainer);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  setSaving() {
    if(this.#mode === Mode.EDITING) {
      const component = this.isNewPoint ? this.#newPointComponent : this.#editPointComponent;

      component.updateElement({
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
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const component = this.#isPointNew ? this.#newPointComponent : this.#editPointComponent;

    const resetFromState = () => {
      component.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    component.shake(resetFromState);
  }


  init(point) {
    this.#pointData = point;

    if(this.isNewPoint) {
      this.renderNewPoint();
      return;
    }

    this.renderPoint();
  }
}
