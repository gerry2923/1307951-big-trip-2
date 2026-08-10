import Observable from '../framework/observable';
import { UpdateType } from '../const';

// const POINTS_NUMBER = 7;

/** При извлечении данных с сервера, необходима получить типы и города назначения списком */

export default class PointsModel extends Observable {
  // массив с точками
  #points = [];
  #offers = [];
  #destinations = [];

  // все города точек и все типы транспорта в виде объекта
  #selectElementsOptions = null;
  #pointApiService = null;

  #extractSelectElementsContentData = () => ({
    typesOptions: this.#offers.map((offer) => offer.type),
    destinationOptions: this.#destinations.map((destination) => destination.name),
  });

  constructor({ pointApiService }) {
    super();
    // this.#points = getRandomPoints(POINTS_NUMBER);
    // выбирает значения для статичных элементов выбора на странце
    // Для этого нужно получить данные по предложениям и точкам  назначения
    // this.#selectElementsOptions =

    this.#pointApiService = pointApiService;

    // this.#pointApiService.points.then((points) => {
    //   console.log(points);

    //   console.log(points.map(this.#adaptToClient));
    // });
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
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

  async updatePoint(updateType, update) {
    // найти задачу с нужным id
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    // заменили точку, на update - та же точка, но с новой информацией
    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatedPoint = this.#adaptPointToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint, ...
        this.#points.slice(index + 1),
      ];
      // вызвали все cb, для обновлелния по типу
      this._notify(updateType, updatedPoint);
      console.log('что-то обновили');
    } catch (err){
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {

    try {
      const response = await this.#pointApiService.addPoint(update);
      const newPoint = this.#adaptPointToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);

    } catch (err){
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);

    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptPointToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };


    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    // console.log(point);
    return adaptedPoint;
  }


  async init() {
    try {

      // если возникнет ошибка загрузки хотя бы одного из требуемых параметров,
      // будет выведено окно с ошибкой

      const [points, offers, destinations] = await Promise.all([
        this.#pointApiService.points,
        this.#pointApiService.offers,
        this.#pointApiService.destinations,
      ]);

      this.#points = points.map(this.#adaptPointToClient);
      this.#offers = offers;
      this.#destinations = destinations;
      this.#selectElementsOptions = this.#extractSelectElementsContentData();

    } catch (err) {
      console.error('Возникла ошибка загрузки данных');
      this.#points = [];
      this.#offers = [];
      this.destination = [];
      throw err;
    }

    this._notify(UpdateType.INIT);
  }

}
