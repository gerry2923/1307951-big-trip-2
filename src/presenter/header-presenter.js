import { render } from '../render.js';
import FilterView from '../view/filter-view.js';


export default class HeaderPresenter {
  constructor({headerContainer}) {
    this.headerContainer = headerContainer;
  }

  init() {
    this.filter = new FilterView();
    render(this.filter, this.headerContainer);
  }
}
