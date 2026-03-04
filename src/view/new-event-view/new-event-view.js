import AbstractView from '../../framework/view/abstract-view.js'


export default class NewEventView extends AbstractView {

  get template() {
    return createNewEventTemplate();
  }
}