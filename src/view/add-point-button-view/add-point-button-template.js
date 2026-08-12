export const createAddPointButtonTemplate = (isDisabled) => `
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`;

export const createDisabledAddPointButtonTemplate = () => `
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>`;
