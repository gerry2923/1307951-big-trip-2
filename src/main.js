import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

import PagePresenter from './presenter/page-presenter';

import { clearElement } from './utils/point';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import PointApiService from './points-api-service';

const AUTHORIZATION = 'Basic qfwminrz5j23k1x';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.trip-events');

const filterModel = new FilterModel();
const sitePointsModel = new PointsModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION),
});

clearElement(siteHeaderElement);

const contentPresenter = new PagePresenter({
  headerContainer: siteHeaderElement,
  mainContainer: siteMainElement,
  pointsModel: sitePointsModel,
  filtersModel: filterModel,
});

contentPresenter.init();
