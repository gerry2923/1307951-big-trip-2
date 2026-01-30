import {createAddNewPointTemplate} from '../add-new-point/add-new-point-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class AddNewPointWithoutOffersView extends AbstractView{
  getTemplate() {
    return createAddNewPointTemplate();
  }

}
