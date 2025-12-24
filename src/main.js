import MainPresenter from '../src/presenter/main-presenter.js';

const LIST_LENGTH = 3;
// сюда вставляем info и filter
const tripMainHeaderContainerElement = document.querySelector('.trip-controls__filters');
// сюда вставляем сортировку, форму создания точки, список точек
const tripEventsContainerElement = document.querySelector('.trip-events');

const mainPresenter = new MainPresenter({
  headerContainer: tripMainHeaderContainerElement,
  eventsContainer: tripEventsContainerElement
});

mainPresenter.init(LIST_LENGTH);
