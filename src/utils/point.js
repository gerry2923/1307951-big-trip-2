import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { MONTHS } from '../const';

dayjs.extend(duration);
dayjs.extend(isBetween);

/**
 *
 * @param {Array} items массив исходных данных, загруженных с сервера
 * @param {Object} updateItem точка, которая была исправлена
 * @returns массив с обновленными данными
 */

export const updateItem = (items, updatePoint) => items.map((item) => item.id === updatePoint.id ? updatePoint : item);


function getWeightForNullDate(dateA, dateB) {
  if (dateA === '' && dateB === '') {
    return 0;
  }

  if (dateA === '') {
    return 1;
  }

  if (dateB === '') {
    return -1;
  }

  return null;
}

export const sortPriceDown = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortDurationDown = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};

export const sortClosestDayFirst = (pointA, pointB) => {

  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  const dateAMs = dayjs(pointA.dateFrom).valueOf();
  const dateBMs = dayjs(pointB.dateFrom).valueOf();
  return weight ?? (dateAMs - dateBMs);
};


export const getAllOffersByType = (offers, type = 'flight') => {
  const isValid = !!offers.length && Array.isArray(offers) && typeof type === 'string';

  if (isValid) {
    const offs = offers.find((offer) => offer.type === type).offers;
    return offs;
  }
  return [];
};

/**
 * @param {Array} - offers массив всех предложений для всех типов
 * @param {Array} - массив id всех предложений, которые добавлены в точку
 * @returns {Array} - массив объектов всех предложений, которые добавлены в точку
 */

export const getSelectedOffers = (offers, offersIds, type = 'flight') => {
  const isValid = !!offers.length &&
    !!offersIds.length &&
    Array.isArray(offers) &&
    Array.isArray(offersIds) &&
    typeof type === 'string';

  if (isValid) {
    const offersByType = offers.find((offer) => offer.type === type).offers;
    const ids = new Set(offersIds);
    return offersByType.filter((offer) => ids.has(offer.id));
  }
};

/**
 * @param {*} dateA
 * @param {*} dateB
 * @returns boolean
 */
export const isDateEquall = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export const getTripDatePeriod = (date1, date2) => {
  const dayFrom = dayjs(date1);
  const dayTo = dayjs(date2);

  const daysDifference = ((new Date(date2)).getMonth() - (new Date(date1)).getMonth());

  if(daysDifference === 0) {
    return {
      dayStart: `${dayFrom.format('DD')}`,
      dayFinish: `${dayTo.format('DD')} ${dayTo.format('MMM')}`,
    };
  }

  return {
    dayStart: `${dayFrom.format('DD')} ${dayFrom.format('MMM')}`,
    dayFinish: `${dayTo.format('DD')} ${dayTo.format('MMM')}`
  };
};

/**
 * @param {*} element - DOM - элемент, внутреннее содержимое которого удаляется
 */

export const clearElement = (element) => {
  if (element.textContent) {
    element.textContent = '';
  }
};


/**
 *
 * @param {String} startISO ISO string like 2026-02-05T22:55:56.845Z
 * @param {String} endISO ISO string 2026-02-06T11:22:13.375Z
 * @return {String} custom date format 02D 15M 00M
 */

export const getDateDifference = (startISO, endISO) => {
  const startDateRaw = dayjs(startISO);
  const endDateRaw = dayjs(endISO);

  if (!startDateRaw.isValid() || !endDateRaw.isValid()) {
    throw new Error('Неверный формат даты. Ожидается ISO 8601.');
  }

  if (startDateRaw.isAfter(endDateRaw)) {
    throw new Error('Дата "До" не может быть позже даты "После".');
  }

  const startDate = startDateRaw.startOf('minute');
  const endDate = endDateRaw.startOf('minute');

  const diffMs = endDate.diff(startDate);
  const diffDuration = dayjs.duration(diffMs);

  const totalMinutes = Math.floor(diffDuration.asMinutes());
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();
  const days = Math.floor(diffDuration.asDays());


  if (totalMinutes < 60) {
    return `${minutes}M`;
  } else if (days < 1) {
    return `${hours}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    return `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
};

/**
 * @param {String} travelDate ISO string like 2026-02-05T22:55:56.845Z
 * @returns {String} time string '10:00' format
 */

export const getCustomTime = (travelDate) => {
  const minutes = String((new Date(travelDate)).getUTCMinutes()).padStart(2, '0');
  const hours = String((new Date(travelDate)).getUTCHours()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getMonthDay = (travelDate) => {
  const date = new Date(travelDate);
  return `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')}`;
};

export const changeToFirstCapitalLetter = (incomingString) => {
  if (!incomingString) {
    return incomingString;
  }
  return incomingString.charAt(0).toUpperCase() + incomingString.slice(1);

};
