import AbstractView from '../../framework/view/abstract-view.js';
import { createNoEventsTemplate } from './no-events-template.js';

export default class NoEventsView extends AbstractView{

  get template() {
    return createNoEventsTemplate();
  }
}
