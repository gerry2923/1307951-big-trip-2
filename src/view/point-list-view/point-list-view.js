import AbstractView from '../../framework/view/abstract-view';
import { createPointListTemplate } from './point-list-template';

export default class PointListView extends AbstractView{

  get template() {
    return createPointListTemplate();
  }

}
