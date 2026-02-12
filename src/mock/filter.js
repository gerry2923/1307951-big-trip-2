import { filter } from '../utils/filter.js';
/**
 *
 * @param {*} tasks передается массив с событиями путешествия
 * Создаем массив массивов из объекта filter. Далее применяем к нему метод map
 * Делаем деструктуризацию и создаем массив объектов. В каждом объекте содержится
 * название фильтра и количество элементов в массиве после фильтрации.
 * @returns возвращается массив с объектами после фильтрации
 * В filterTasks записывается анонимная функция, которая была в качестве значения
*/
function generateFilter(tasks) {
  return Object.entries(filter).map(
    ([filterType, filterTasks]) => ({
      type: filterType,
      count: filterTasks(tasks).length,
    }),
  );
}

export {generateFilter};
