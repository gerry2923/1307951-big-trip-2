import AddNewPointView from '../view/new-point-view/new-point-view';
import { render } from '../framework/render';

// создание формы, в которую можно добавить данные о новой точке и добавить эту точку в список маршрута
export default class NewPointPresenter {

  #newPointComponent = null;
  #newPointContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({newPointContainer, onDataChange, onDestroy}) {
    console.log('создали презентер новой точки.');

    this.#newPointContainer = newPointContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  createNewPointComponent(){
    this.#newPointComponent = new AddNewPointView();
    render(this.#newPointComponent, this.#newPointContainer);
  }

  init() {
    this.createNewPointComponent();
  }
}
