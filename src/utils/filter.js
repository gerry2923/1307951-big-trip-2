import { FilterType } from '../const';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],

  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs.utc().diff(dayjs(point.dateFrom)) < 0),
  [FilterType.PRESENT]: (points) => points.filter((point) =>
    (dayjs.utc().diff(dayjs(point.dateFrom)) >= 0) &&
    (dayjs.utc().diff(dayjs(point.dateTo)) <= 0)),

  [FilterType.PAST]: (points) => points.filter((point) => dayjs.utc().diff(dayjs(point.dateTo)) > 0),
};

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterType, filterExecutor]) => ({
    type: filterType,
    filterPoints: filterExecutor(points),
  })
);
