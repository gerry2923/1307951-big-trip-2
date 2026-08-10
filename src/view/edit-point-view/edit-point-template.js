import 'flatpickr/dist/flatpickr.min.css';
import { getAllOffersByType, } from '../../utils/point';

const getFirstTitleWord = (text) => text.trim().toLowerCase().split(/\s+/)[0];

const createControlButtonTemplate = (isNewPoint, isSaving, isDeleting) => isNewPoint ? `
                  <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>` : `

                  <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
                  <button class="event__rollup-btn" type="button">`;

const createDestinationListTemplate = (destinations) => {
  // console.log(destinations);
  let cities = '';

  destinations.forEach((destination) => {
    // console.log(destination);
    cities += `
    <option value="${destination}"></option>
    `;
  });

  return cities;
};

const createTypeListTemplate = (types) => {

  let options = '';

  types.forEach((type) => {
    options += `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`;
  });

  return options;
};

const createOffersTemplate = (point) => {
  // ToDo:
  // если нет выбранных офферов то создаем просто все предложения серыми
  // есл нет описания объекта
  const allOffersByType = getAllOffersByType(point.allOffers, point.type);
  const idsSelectedOffers = new Set(point.offers.map((offer) => offer.id));
  let offersStr = '';

  allOffersByType.forEach((offer) => {
    if(idsSelectedOffers.has(offer.id)) {
      offersStr += `<div class="event__offer-selector">
                         <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${getFirstTitleWord(offer.title)}" checked>
                         <label class="event__offer-label" for="${offer.id}">
                           <span class="event__offer-title">${offer.title}</span>
                           &plus;&euro;&nbsp;
                           <span class="event__offer-price">${offer.price}</span>
                         </label>
                       </div>`;
    } else {
      offersStr += `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${getFirstTitleWord(offer.title)}">
                        <label class="event__offer-label" for="${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
    }
  });
  return offersStr ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
              ${offersStr}
              </div>
          </section>` : '';

};

const createPictureListTemplate = (point) => {

  let pictures = '';
  const isPictures = !!point.destination.pictures.length;
  if (isPictures) {
    point.destination.pictures.forEach((picture) => {
      pictures += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });
  }

  return isPictures ? `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${pictures}
            </div>
        </div>` : '';
};

const createDescriptionTemplate = (point) => point.destination.description ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${point.destination.name}</h3>
            <p class="event__destination-description">${point.destination.description}</p>
          </section>
          ${createPictureListTemplate(point)}` : '';

export const createEditPointTemplate = (point) => `
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypeListTemplate(point.typesOptions)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">

                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${point.type}
                    </label>

                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.destination.name || ''}" placeholder="Выберите из списка" list="destination-list-1">

                    <datalist id="destination-list-1">
                      ${createDestinationListTemplate(point.destinationsOptions)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom}">
                    &mdash;

                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                     &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.basePrice}">
                  </div>
                    ${createControlButtonTemplate(point.isPointNew, point.isSaving, point.isDeleting)}

                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>

                <section class="event__details">
                  ${createOffersTemplate(point)}

                  ${point.destination !== '' ? createDescriptionTemplate(point) : ''}

                </section>
              </form>
`;
