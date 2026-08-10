import AbstractView from '../../framework/view/abstract-view';
import { createDisabledAddPointButtonTemplate } from '../add-point-button-view/add-point-button-template';

export default class AddDisabledPointButtonView extends AbstractView {

  get template() {
    return createDisabledAddPointButtonTemplate();
  }
}
