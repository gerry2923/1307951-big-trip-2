import { FilterTypes } from '../../const';

const NoPointTextType = {
  [FilterTypes.EVERYTHING] : 'Click New Event to create your first point',
  [FilterTypes.FUTURE] : 'There are no past events now',
  [FilterTypes.PRESENT] : 'There are no present events now',
  [FilterTypes.PAST] : 'There are no future events now',
};

export const createEmptyPointTemplate = (filterType) => {
  console.log(filterType);
  const message = NoPointTextType[filterType];

  return `
    <p class='trip-events__msg'>${message}</p>
  `;
};
