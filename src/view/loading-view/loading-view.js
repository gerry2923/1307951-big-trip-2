import AbstractView from '../../framework/view/abstract-view';
import { createLoadingTemplate } from './loading-template';

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
