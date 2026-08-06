import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

import PagePresenter from './presenter/page-presenter';
import EmptyPagePresenter from './presenter/_empty-page-presenter';

import { offers } from './moks/mock-offers';
import { destinationPoints } from './moks/mock-destination';

import { clearElement } from './utils/common';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.trip-events');
const filterModel = new FilterModel();
const sitePointsModel = new PointsModel(); // добавляет данные с сервера
const siteOffers = offers;
const siteDestination = destinationPoints;

clearElement(siteHeaderElement);

/**  добавить загрузку  сервера
 * данные не загрузились
 * загрузка все еще идет
*/

const contentPresenter = new PagePresenter({
  headerContainer: siteHeaderElement,
  mainContainer: siteMainElement,
  pointsModel: sitePointsModel,
  filtersModel: filterModel,
  offers: siteOffers,
  destinations: siteDestination
});

contentPresenter.init();
