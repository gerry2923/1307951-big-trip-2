import { createPointListItemTemplate } from '../point-list-item-view/point-list-item-template';
import AbstractView from '../../framework/view/abstract-view';

export default class PointListItemView extends AbstractView{
  get template() {
    return createPointListItemTemplate();
  }

}
