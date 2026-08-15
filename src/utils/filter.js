import { FilterTypes } from '../const';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const filter = {
  [FilterTypes.EVERYTHING]: (points) => [...points],

  [FilterTypes.FUTURE]: (points) => points.filter((point) => dayjs.utc().diff(dayjs(point.dateFrom)) < 0),
  [FilterTypes.PRESENT]: (points) => points.filter((point) =>
    (dayjs.utc().diff(dayjs(point.dateFrom)) >= 0) &&
    (dayjs.utc().diff(dayjs(point.dateTo)) <= 0)),

  [FilterTypes.PAST]: (points) => points.filter((point) => dayjs.utc().diff(dayjs(point.dateTo)) > 0),
};

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterType, filterExecutor]) => ({
    type: filterType,
    filterPoints: filterExecutor(points),
  })
);
