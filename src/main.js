// в этом модуле я создаю объекты, которые будут заливать данные с сервера (tripEvents, offers, destination)

import MainPresenter from '../src/presenter/main-presenter.js';
import TripEventsModel from './model/trip-events-model.js';

// const LIST_LENGTH = 3; // длина списка будет передаваться с тем количеством событий, которые создадутся в tripEventModel (это значение константы)
// сюда вставляем info и filter
const tripMainHeaderContainerElement = document.querySelector('.trip-controls__filters');
// сюда вставляем сортировку, форму создания точки, список точек
const tripEventsContainerElement = document.querySelector('.trip-events');
// создаем экземпляр модели событий поездки
const tripEventsModel = new TripEventsModel();
// создаем экземпляр модели специальных предложений
const offersModel = new OffersModel();
// создаем экземпляр модели точек маршрута
const destinationsModel = new DestinationsModel();



const mainPresenter = new MainPresenter({
  headerContainer: tripMainHeaderContainerElement,
  eventsContainer: tripEventsContainerElement,
  tripEventsModel,
  offersModel,
  destinationsModel,
});

mainPresenter.init();
