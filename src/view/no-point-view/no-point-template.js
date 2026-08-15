import { FilterType } from '../../const';

const NoPointTextType = {
  [FilterType.EVERYTHING] : 'Click New Event to create your first point',
  [FilterType.FUTURE] : 'There are no future events now',
  [FilterType.PRESENT] : 'There are no present events now',
  [FilterType.PAST] : 'There are no past events now',
};

export const createEmptyPointTemplate = (filterType) => {
  const message = NoPointTextType[filterType];

  return `
    <p class='trip-events__msg'>${message}</p>
  `;
};
