import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { createNewPointTemplate } from './new-point-template';

export default class NewPointView extends AbstractStatefulView{


  constructor() {
    super();
  }

  get template() {
    return createNewPointTemplate(this._state);
  }
}
