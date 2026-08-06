import dayjs from 'dayjs';

/**
 *
 * @param {Array} items массив исходных данных, загруженных с сервера
 * @param {Object} updateItem точка, которая была исправлена
 * @returns массив с обновленными данными
 */

export const updateItem = (items, updatePoint) => items.map((item) => item.id === updatePoint.id ? updatePoint : item);

// TODO: организовать сортировку

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
// function getWeightForNullDate(dateA, dateB) {
//   if (dateA === null && dateB === null) {
//     return 0;
//   }

//   if (dateA === null) {
//     return 1;
//   }

//   if (dateB === null) {
//     return -1;
//   }

//   return null;
// }

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
 * @param {Array}- массис с объектами предложений, которые выбраны
 * @returns {Array} - массив с id предложений, которые выбраны
 */

export const getSelectedOffersIds = (offers) => {
  const isValid = offers && Array.isArray(offers);

  if (isValid) {
    return offers.map((offer) => offer.id);
  }
};

/**
 * @param {*} dateA -
 * @param {*} dateB
 * @returns boolean
 */
export const isDateEquall = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export const isFromDateEarlierToDate = (dateFrom, dateTo) => (dayjs(dateTo).valueOf() - dayjs(dateFrom).valueOf()) > 300000;
/***** не надо */
// export const getAllOffersByType = (point) => point.allOffers.find((offersByType) => offersByType.type === point.type);

/**
 * @param {Array} - массив с объектами вида [ { type: '', offers: [...]}]
 * @returns {Array} - массив с предложениями для одного типа offers[]
 */
/**
 * @param {Array}- массив с id предложений, которые выбраны
 * @returns {Array} - массис с объектами предложений, которые выбраны


export const getSelectedOffersFromByType = (offersIds, offersByType) => {
  const isValid = offersIds &&
    Array.isArray(offersIds) &&
    offersByType &&
    Array.isArray(offersByType);

  if (isValid) {
    const ids = new Set(offersIds);
    return offersByType.filter((offer) => ids.has(offer.id));
  }
};
 */
