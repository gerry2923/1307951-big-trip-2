import {createAddNewPointWithoutOffersTemplate} from '../add-new-point/add-new-point-without-offers-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class AddNewPointWithoutOffersView extends AbstractView{
  get template() {
    return createAddNewPointWithoutOffersTemplate();
  }

}
