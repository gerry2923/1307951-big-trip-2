import { getRandomArrayElement } from '../utils/common.js';
import {nanoid} from 'nanoid';

const tripEvents = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: false,
    offers: [],
    type: 'taxi'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: 1100,
    dateFrom: '2026-02-05T22:55:56.845Z',
    dateTo: '2026-02-06T11:22:13.375Z',
    destination: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    isFavorite: false,
    offers: [
      'a1b2c3d4-e5f6-7890-AbCd-Ef1234567890',
      'b2c3d4e5-f6g7-8901-bCdE-f23456789012',
      'c3d4e5f6-g7h8-9012-cDeF-345678901234'
    ],
    type: 'taxi'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a9708c',
    basePrice: 200,
    dateFrom: '2026-03-05T22:55:56.845Z',
    dateTo: '2026-04-01T11:22:13.375Z',
    destination: 'd4e5f6g7-h8i9-0123-def0-456789012548',
    isFavorite: false,
    offers: [],
    type: 'bus',
  },
  {
    id: 'g5c731aa-3a4g-5d4e-b813-a5ffd5b3919d',
    basePrice: 850,
    dateFrom: '2019-07-12T10:30:00.000Z',
    dateTo: '2019-07-12T14:45:00.000Z',
    destination: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    isFavorite: true,
    offers: [
      'e5f6g7h8-i9j0-1234-eFgH-567890123456',
      'f6g7h8i9-j0k1-2345-fGhI-678901234567'
    ],
    type: 'bus'
  },
  {
    id: 'h6d842bb-4b5h-6e5f-c924-b6gge6c4a02e',
    basePrice: 1450,
    dateFrom: '2019-07-13T08:15:22.123Z',
    dateTo: '2019-07-13T18:30:45.678Z',
    destination: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
    isFavorite: false,
    offers: [
      'j0k1l2m3-n4o5-6789-jKlM-012345678901',
      'k1l2m3n4-o5p6-7890-kLmN-123456789012',
      'l2m3n4o5-p6q7-8901-lMnO-234567890123',
    ],
    type: 'train'
  },
  {
    id: 'i7e953cc-5c6i-7f6g-d035-c7hhf7d5b13f',
    basePrice: 2200,
    dateFrom: '2019-07-15T14:20:10.456Z',
    dateTo: '2019-07-18T09:15:33.789Z',
    destination: 'd4e5f6g7-h8i9-0123-def0-456789012345',
    isFavorite: true,
    offers: ['n4o5p6q7-r8s9-0123-nOpQ-456789012345'],
    type: 'ship'
  },
  {
    id: 'j8f064dd-6d7j-8g7h-e146-d8iig8e6c24g',
    basePrice: 950,
    dateFrom: '2026-02-20T16:45:30.234Z',
    dateTo: '2026-02-20T19:10:15.567Z',
    destination: 'e5f6g7h8-i9j0-1234-ef01-567890123456',
    isFavorite: false,
    offers: [
      'w3x4y5z6-a7b8-9012-wXyZ-345678901234',
      'x4y5z6a7-b8c9-0123-xYzA-456789012345',
      'y5z6a7b8-c9d0-1234-yZaB-567890123456',
      'z6a7b8c9-d0e1-2345-zAbC-678901234567',
    ],
    type: 'flight'
  }
];

/**
 * Возвращает один объект массива точка путешествия
 * @returns {obj}
 */
function getRundomTripEvent() {
  // return {
  //   id: nanoid(),
  //   ...getRandomArrayElement(tripEvents)
  // };

  return getRandomArrayElement(tripEvents);
}

/** Проверка уникальности по id объекта */
function isUnique(objectsArray) {
  const unique = objectsArray.reduce((accumulator, current) => {
    // const isIdEqual = (element) => element.id
    if (accumulator.findIndex((object) => object.id === current.id) === -1) {
    // if (accumulator.findIndex((object) => object.id === current.id)) === -1) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return unique;
}

function getRundomTripEventArray(arrayLength) {

  let tripEventsArray = [];

  while (tripEventsArray.length !== arrayLength) {
    tripEventsArray.push(getRundomTripEvent());
    tripEventsArray = tripEventsArray.filter((v, i, arr) => arr.indexOf(v) === i);
  }

  return tripEventsArray;
}

export { getRundomTripEvent, getRundomTripEventArray };
