import {createAddNewPointTemplate} from '../add-new-point/add-new-point-template.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

export default class AddNewPointWithoutOffersView extends AbstractStatefulView{


  getTemplate() {
    return createAddNewPointTemplate();
  }

}
