import axios from 'axios';
import jsCookie from 'js-cookie';
import Common from '../../modules/common';
import { BASE_URL } from '../constants';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

instance.interceptors.request.use(function (config) {
  Common.Actions.addLoading();
  config.headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + jsCookie.get('JWT')
  }
  return config
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  try {
    Common.Actions.removeLoading();
    if (response.data.code !== 200)
      return Promise.reject(response.data);
    return response.data.value;
  } catch (error) {
    return Promise.reject(error);
  }
}, function (error) {
  Common.Actions.removeLoading();
  try {
    if (error.response.status === 401) {
      Common.Actions.requestLogout()
    } else {
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
});

export default instance;