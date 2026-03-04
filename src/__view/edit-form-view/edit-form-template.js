import { DATE_FORMAT } from '../../const.js';
// import { destinationPoints } from '../../mock/mockDestination.js';
import { convertDateFromat } from '../../utils/event.js';


function createEditFormTemplate({destinationTripPoints, tripEvent, destination, allOffers, appliedOffers}) {
  const destPoints = destinationTripPoints;
  const {dateFrom, dateTo, basePrice, type} = tripEvent;
  const fromDate = convertDateFromat(dateFrom, DATE_FORMAT['DD/MM/YY HH:mm']);
  const toDate = convertDateFromat(dateTo, DATE_FORMAT['DD/MM/YY HH:mm']);
  // console.log('destination');
  // console.log(destination);
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
                    value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="flight" checked="">
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in"
                    for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing"
                    for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio"
                    name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant"
                    for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text"
              name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getAllDestinations(destPoints)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${fromDate}">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${toDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">${basePrice}</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
              value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="button">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${getOffers(allOffers, appliedOffers)}
          ${getDestinationPicturs(destination)}
        </section>
      </form>
    </li>`
  );
}

function getDestinationPicturs(destination) {
  let pictureList = '';

  if (!destination.description && !destination.pictures.length) {
    return '';
  }

  if (!destination.pictures.length) {
    return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
          </section>`;
  }

  destination.pictures.forEach((item) => {
    pictureList += `<img class="event__photo" src="${item.src}" alt="${item.description}"></img>`;
  });

  pictureList = `<section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${destination.description}</p>
                  <div class="event__photos-container">
                    <div class="event__photos-tape">${pictureList}
                    </div>
                  </div>
                </section>`;

  return pictureList;
}

function getOffers(offers, appliedOffers) {

  let listContent = '';
  if(!offers.length) {
    return '';
  }

  offers.forEach((offer) => {

    listContent += `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isOfferChecked(offer, appliedOffers)}>
                        <label class="event__offer-label" for="event-offer-luggage-1">
                          <span class="event__offer-title">${offer.title}</span>
                            &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  });

  listContent = `<section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                    ${listContent}
                  </div>
                </section>`;

  return listContent;
}

function isOfferChecked(currentOffer, offers) {
  return offers.some((offer) => offer.id === currentOffer.id) ? 'checked' : '';
}

function getAllDestinations(points) {
  let pointsElement = '';
  points.forEach((point) => {
    pointsElement += `<option value="${point}"></option>`;
  });
  return pointsElement;
}

export {createEditFormTemplate};
