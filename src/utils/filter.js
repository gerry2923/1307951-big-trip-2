import { FilterType } from '../const';
import { isEventDateExpired, isEventDateInFuture, isEventDateInPresent } from '../utils/event.js';

/**
 * ключами объекта filter является строковое значение константы нумерованого списка FilterType фильтра
 * значением объекта filter является анонимная функция, которая принимает на входе массив из событий путешествия и выполняет фильтрацию данных элементов в зависимости от применяемой функции из файла event.js
 */
const filter = {
  [FilterType.EVERYTHING]: (tripEvents) => tripEvents.filter((tripEvent) => tripEvent),
  [FilterType.FUTURE]: (tripEvents) => tripEvents.filter((tripEvent) => isEventDateInFuture(tripEvent.dateFrom)),
  [FilterType.PAST]: (tripEvents) => tripEvents.filter((tripEvent) => isEventDateExpired(tripEvent.dateTo)),
  [FilterType.PRESENT]: (tripEvents) => tripEvents.filter((tripEvent) => isEventDateInPresent(tripEvent.dateFrom, tripEvent.dateTo)),
};


export {filter};
