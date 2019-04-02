import cookie from 'js-cookie';
import * as Types from './actionTypes';
import { store } from '../../../reduxModule';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants';

export const switchLocale = (locale) => ({
  type: Types.SWITCH_LOCALE,
  payload: locale
});

export const addLoading = () => {
  store.dispatch({ type: Types.ADD_LOADING })
}

export const removeLoading = () => {
  store.dispatch({ type: Types.REMOVE_LOADING })
}

export const requestLogin = (res, user) => {
  cookie.set(TOKEN_KEY, res['access_token']);
  cookie.set(REFRESH_TOKEN_KEY, res['refresh_token']);
  store.dispatch({ type: Types.REQUEST_LOGIN, payload: user });
  window.location.href = '#/';
}

export const requestLogout = () => {
  cookie.remove('JWT');
  localStorage.setItem('logout', Date.now())
  store.dispatch({ type: Types.REQUEST_LOGOUT });
  window.location.href = '#/login';
}