import * as device from 'react-device-detect';
import { logEvent } from 'firebase/analytics';
import { v4 as uuidv4 } from 'uuid';
import { mapPathNameToCategory } from '../service';
import { analytics } from './firebase';
import axiosTracking from '@/api/base/axios-tracking';
import axios from 'axios';

let lastime = 0;
let timmer = null;

let instanceAnalytics = null;
let data = {
  schemaVersion: '1.0',
  ip: '',
  city: '',
  province: '',
  country: '',
  deviceID: '',
  deviceType: '',
  fid: '1:59170763125:web:9cd43888a6947c4075e33c', //Firebase ID
  platform: '',
  browser: '',
  browserVersion: '',
  buildVersion: '1.0.3',
  host: '',
  userID: '',
  sessionID: '',
  eventTime: '',
  eventName: '',
  params: {}
};

export const updateDataEventLog = (payload) => {
  data = { ...data, ...payload };
};

//
export const initEventLog = async () => {
  instanceAnalytics = analytics();
  const locationLocal = window.localStorage.getItem('location');
  const infoLocation = locationLocal ? JSON.parse(locationLocal) : {};

  if (!infoLocation.deviceID) {
    infoLocation.deviceID = uuidv4();
    window.localStorage.setItem('location', JSON.stringify(infoLocation));
  }
  const { deviceType, browserName, osName, browserVersion } = device;
  try {
    // create and stored on localStorage
    let ipJson = {};
    if (infoLocation.ip) ipJson = { ip: infoLocation.ip };
    else ipJson = await axios.get('https://api.ipify.org?format=json');
    if (ipJson.ip !== infoLocation.ip) {
      infoLocation.ip = ipJson.ip;
      const { country, city, region } = await axios.get('http://ip-api.com/json/' + ipJson.ip);
      infoLocation.country = country;
      infoLocation.city = city;
      infoLocation.region = region;
      window.localStorage.setItem('location', JSON.stringify(infoLocation));
    }
  } catch (error) {
    console.log(error);
  }

  const payload = {
    // info location
    country: infoLocation.country,
    city: infoLocation.city,
    province: infoLocation.region,
    ip: infoLocation.ip,
    // detect device
    browserVersion,
    deviceType: deviceType === 'browser' ? 'pc' : deviceType,
    browser: browserName,
    host: window.location.host,
    platform: osName,
    deviceID: infoLocation.deviceID,
    // orther
    sessionID: new Date().getTime()
  };

  updateDataEventLog(payload);
  return true;
};

export const Tracker = {
  updateBody(body) {
    data = { ...data, ...body };
  },
  async send(payload) {
    const isLocal = window.location.href.includes('localhost');

    if (!payload) return;
    const body = { ...data };
    const category = payload?.category || mapPathNameToCategory[window.location.pathname] || '';

    body.eventName = category + '_' + payload.action + '_' + payload.event;
    body.eventTime = new Date().getTime();
    body.params = payload.params || {};
    if (body.params?.info_value) body.params.info_value = body.params.info_value + '';

    if (!instanceAnalytics) instanceAnalytics = analytics();
    if (lastime === 0) {
      if (!isLocal) {
        logEvent(instanceAnalytics, 'logIn_opened_session', {});
        axiosTracking.post('/adl_web', body);
      }
    }
    clearTimeout(timmer);
    timmer = setTimeout(() => {
      lastime = 0;
      if (!isLocal) {
        logEvent(instanceAnalytics, 'logIn_closed_session', {});
        axiosTracking.post('/adl_web', body);
      }
    }, 30 * 60 * 1000);

    lastime = body.eventTime;

    if (!isLocal) {
      logEvent(instanceAnalytics, body.eventName, { ...body.params });
      axiosTracking.post('/adl_web', body);
    }
    // console.log(body);
  }
};
