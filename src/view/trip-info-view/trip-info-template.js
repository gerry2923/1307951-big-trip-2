export const createTripInfoTemplate = (destination, price, {dayStart, dayFinish}) =>
  `<section class="trip-main__trip-info  trip-info">
    <div div class="trip-info__main" >
      <h1 class="trip-info__title">${destination}</h1>

      <p class="trip-info__dates">${dayStart} &nbsp;&mdash;&nbsp; ${dayFinish}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section >`;
