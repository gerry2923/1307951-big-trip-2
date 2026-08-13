import Observable from '../framework/observable';
import { UpdateType } from '../const';


export default class PointsModel extends Observable {
  #points = [];
  #offers = [];
  #destinations = [];

  #selectElementsOptions = null;
  #pointApiService = null;

  #extractSelectElementsContentData = () => ({
    typesOptions: this.#offers.map((offer) => offer.type),
    destinationOptions: this.#destinations.map((destination) => destination.name),
  });

  constructor({ pointApiService }) {
    super();
    this.#pointApiService = pointApiService;

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

  async updatePoint(updateType, update) {

    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }


    const response = await this.#pointApiService.updatePoint(update);
    const updatedPoint = this.#adaptPointToClient(response);

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint, ...
      this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);

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

    return adaptedPoint;
  }


  async init() {
    try {
      const points = await this.#pointApiService.points;
      const offers = await this.#pointApiService.offers;
      const destinations = await this.#pointApiService.destinations;

      this.#points = points.map(this.#adaptPointToClient);
      this.#offers = offers;
      this.#destinations = destinations;
      this.#selectElementsOptions = this.#extractSelectElementsContentData();

      this._notify(UpdateType.INIT);

    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.destination = [];
      this._notify(UpdateType.ERROR);
    }

  }

}
