import {createAddNewPointWithoutDestinationTemplate} from '../add-new-point/add-new-point-without-destination-template.js';
import AbstractView from '../../framework/view/abstract-view.js';


export default class AddNewPoinWithoutDestinationtView extends AbstractView{
  get template() {
    return createAddNewPointWithoutDestinationTemplate();
  }


}
