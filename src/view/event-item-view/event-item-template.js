import { convertDateFromat, shortenDateString, dateDifferenceHoursMinutes } from '../../utils.js';
import { DATE_FORMAT } from '../../const.js';

function createEventTemplate(tripEvent, tripEventsModel) {
  const dateFrom = tripEvent.dateFrom;
  const dateTo = tripEvent.dateTo;

  const dateFromYearMonthDate = convertDateFromat(dateFrom, DATE_FORMAT['YYYY-MM-DD']);
  const dateFromMonthDate = convertDateFromat(dateFrom, DATE_FORMAT['MMM DD']);
  const dateFromYearMonthDateTime = shortenDateString(dateFrom);
  const dateFromHoursMinutes = convertDateFromat(dateFrom, DATE_FORMAT['HH:mm']);

  const dateToYearMonthDateTime = shortenDateString(dateTo);
  const dateToHoursMinutes = convertDateFromat(dateTo, DATE_FORMAT['HH:mm']);

  return (
    `<div class="event">
      <time class="event__date" datetime="${dateFromYearMonthDate}">${dateFromMonthDate}</time>

      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${tripEvent.type}.png" alt="Event type icon">
      </div>

      <h3 class="event__title">${tripEventsModel.getTripTitle(tripEvent)}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFromYearMonthDateTime}">${dateFromHoursMinutes}</time>
          —
          <time class="event__end-time" datetime="${dateToYearMonthDateTime}">${dateToHoursMinutes}</time>
        </p>
        <p class="event__duration">${dateDifferenceHoursMinutes(dateFrom, dateTo)}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${tripEvent.basePrice}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>

      <ul class="event__selected-offers">
        ${getOffersOfTripEvent(tripEvent, tripEventsModel)}
      </ul>

      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>

    </div>`
  );
}

function getOffersOfTripEvent(tripEvent, tripEventsModel) {
  const offers = tripEventsModel.getOffersByEvent(tripEvent);
  let listContent = '';
  offers.forEach((item) => {
    listContent += `<li class="event__offer">
          <span class="event__offer-title">${item.title}</span>
          +€&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </li>`
  });

  return listContent;
};

export {createEventTemplate};
