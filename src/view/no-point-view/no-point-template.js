import { FilterTypes } from '../../const';

const NoPointTextType = {
  [FilterTypes.EVERYTHING] : 'Click New Event to create your first point',
  [FilterTypes.FUTURE] : 'There are no future events now',
  [FilterTypes.PRESENT] : 'There are no present events now',
  [FilterTypes.PAST] : 'There are no past events now',
};

export const createEmptyPointTemplate = (filterType) => {
  const message = NoPointTextType[filterType];

  return `
    <p class='trip-events__msg'>${message}</p>
  `;
};
