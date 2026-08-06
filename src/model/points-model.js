import { getRandomPoints } from '../moks/mock-trip-event';
import { destinationPoints as destinations } from '../moks/mock-destination';
import { offers } from '../moks/mock-offers';
import Observable from '../framework/observable';

const POINTS_NUMBER = 7;

/** При извлечении данных с сервера, необходима получить типы и города назначения списком */

export default class PointsModel extends Observable {
  // массив с точками
  #points = null;
  // все города точек и все типы транспорта в виде объекта
  #selectElementsOptions = null;


  #extractSelectContentData = () => ({
    typesOptions: offers.map((offer) => offer.type),
    destinationOptions: destinations.map((destination) => destination.name),
  });

  constructor() {
    super();
    this.#points = getRandomPoints(POINTS_NUMBER);
    this.#selectElementsOptions = this.#extractSelectContentData();
  }

  get points() {
    return this.#points;
  }

  set points(newPoints) {
    this.#points = newPoints;
  }

  get selectElementsOptions() {
    return this.#selectElementsOptions;
  }
  /**
   *
   * @param {*} updateType - update, add, delete
   * @param {*} update - точка с измененными данными
   */

  updatePoint(updateType, update) {
    // найти задачу с нужным id
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error ('Can\'t update unexisting point');
    }
    // заменили точку, на update - та же точка, но с новой информацией
    this.#points = [
      ...this.#points.slice(0, index),
      update, ...
      this.#points.slice(index + 1),
    ];
    // вызвали все cb, для обновлелния по типу
    this._notify(updateType, update);
    console.log('что-то обновили');
  }

  addPoint(updateType, update) {

    this.#points = [update, ...this.#points];
    this._notify(updateType, update);

    console.log('что-то добавили');
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
    console.log('что-то удалили');
  }

}
