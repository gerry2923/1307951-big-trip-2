import { FilterTypes } from '../const';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const filter = {
  // полный список точек маршрута
  [FilterTypes.EVERYTHING]: (points) => points,

  // точки маршрута, у которых дата начала события больше текущей даты
  [FilterTypes.FUTURE]: (points) => {
    const today = dayjs.utc();
    console.log();

    const array = points.filter((point) => {
      // console.log(today.format());
      console.log(point.dateFrom);
      // console.log(dayjs.utc().diff(dayjs(point.dateFrom)));
      return dayjs.utc().diff(dayjs(point.dateFrom)) < 0;
    });

    console.log(array);
    return points.filter((point) => dayjs.utc().diff(dayjs(point.dateFrom)) < 0);
  },

  // точки, у которых дата начала события меньше или равна текущей даты, а дата окончания больше или равна текущей даты
  [FilterTypes.PRESENT]:(points) => points.filter((point) =>
    (dayjs.utc().diff(dayjs(point.dateFrom)) >= 0) &&
    (dayjs.utc().diff(dayjs(point.dateTo)) <= 0)
  ),

  // дата окончания маршрута меньше чем текущая
  [FilterTypes.PAST]: (points) => points.filter((point) => dayjs.utc().diff(dayjs(point.dateFrom)) > 0),
};

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterType, filterExecutor]) => ({
    type: filterType, // тип фильтра
    filterPoints: filterExecutor(points), // отфильтрованные точки
  })
);
