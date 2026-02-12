import AbstractView from '../../framework/view/abstract-view';
import { createNoEventsTemplate } from './no-events-template.js';

export default class NoEventsView extends AbstractView{

  get template() {
    return createNoEventsTemplate();
  }
}
