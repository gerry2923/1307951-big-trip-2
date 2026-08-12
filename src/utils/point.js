import dayjs from 'dayjs';
import { MONTH } from '../const';
const HOUR = 3600000; // milliseconds
const DAY = 86400000; // milliseconds

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

export const isFromDateEarlierToDate = (dateFrom, dateTo) => (dayjs(dateTo).valueOf() - dayjs(dateFrom).valueOf()) > 300000;

export const getTripDatePeriod = (date1, date2) => {
  const dayFrom = dayjs(date1);
  const dayTo = dayjs(date2);

  if(dayFrom.diff(dayTo, 'month') === 0) {
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
 * @param {String} dateFrom ISO string like 2026-02-05T22:55:56.845Z
 * @param {String} dateTo ISO string 2026-02-06T11:22:13.375Z
 * @return {String} custom date format 02D 15M 00M
 */

export const getDateDifference = (travelDateFrom, travelDateTo) => {

  const dateFrom = Date.parse(travelDateFrom);
  const dateTo = Date.parse(travelDateTo);

  const delta = dateTo - dateFrom;

  if(delta > 0) {
    const date = new Date(delta);

    if(delta < HOUR) {
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${minutes}М`;

    } else if (delta < DAY) {
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      return `${hours}H ${minutes}M`;

    } else {
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const days = String(date.getUTCDate()).padStart(2, '0');
      return `${days}D ${hours}H ${minutes}M`;
    }
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
  return `${MONTH[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')}`;
};

export const changeToFirstCapitalLetter = (incomingString) => {
  if (!incomingString) {
    return incomingString;
  }
  return incomingString.charAt(0).toUpperCase() + incomingString.slice(1);

};
