/**
 *
 * @param {*} items массив элементов, из которого рандомным образом нужно взять элемент
 * @returns один элемент массива
 */

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}
/**
 *
 * @param {Array} items масси элементов
 * @param {*} update объект, на который нужно заменить элемент массива
 * @returns обновленный масси элементов
 */
// function updateItem(items, update) {
//   return items.map((item) => item.id === update.id ? update : item);
// }
// локальное времяа
function setTimeZoneOffset(stringDate) {
  let date = new Date(stringDate);
  date = Date.parse(date) + date.getTimezoneOffset() * 60000;
  return new Date(date);
}

function setTimeZoneOffsetReverse(date) {
  const tzDate = Date.parse(date) - date.getTimezoneOffset() * 60000;
  return new Date(tzDate);
}

function isEarlier (dateFrom, dateTo) {

    const difference = dateTo.getTime() - dateFrom.getTime();
    return (difference < 0) ;
  }

function getDateWithMinTripTimeOffset (date, offset) {
    const timestamp = date.getTime() + offset;
    return new Date(timestamp);
  }

function getDaysDifference(dayFrom, dayTo) {
    if(typeof dayFrom === 'string') {
      dayFrom = new Date(dayFrom);
    }

    if(typeof dayTo === 'string') {
      dayTo = new Date(dayTo);
    }

    return dayTo.getTime() - dayFrom.getTime();
  }



export {getDaysDifference, getDateWithMinTripTimeOffset, getRandomArrayElement, updateItem, isEarlier, setTimeZoneOffset,setTimeZoneOffsetReverse};
