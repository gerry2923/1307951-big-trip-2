import AbstractView from '../../framework/view/abstract-view';
import { createDisabledFilterTemplate } from '../filter-view/filter-template';

export default class DisabledFilterView extends AbstractView {
  get template() {
    return createDisabledFilterTemplate();
  }
}
