import AbstractView from '../../framework/view/abstract-view';
import { createFailLoadingTemplate } from './fail-loading-template';

export default class FailLoadingView extends AbstractView{

  get template() {
    return createFailLoadingTemplate();
  }
}
