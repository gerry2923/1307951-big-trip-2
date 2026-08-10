import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

import PagePresenter from './presenter/page-presenter';

import { clearElement } from './utils/common';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import PointApiService from './points-api-service';

const AUTHORIZATION = 'Basic qfwminrz5j23k1x';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.trip-events');

const filterModel = new FilterModel();
// const sitePointsModel = new PointsModel(); // добавляет данные с сервера
const sitePointsModel = new PointsModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION),
}); // добавляет данные с сервера


// const siteOffers = sitePointsModel.offers;
// const siteDestination = sitePointsModel.destinations;


// console.log(siteOffers);
// console.log('-----------------');
// console.log(siteDestination);
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
  // offers: siteOffers,
  // destinations: siteDestination
});

contentPresenter.init();
