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
function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getRandomArrayElement, updateItem};
