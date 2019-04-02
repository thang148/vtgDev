import * as Constants from '../constants';
import * as Types from './actionTypes';
import cookie from 'js-cookie';
import jwt from 'jwt-decode';

function auth() {
  const key = cookie.get('JWT')
  return key && String(key).length > 0;
}

const initialState = {
  locale: Constants.DEFAULT_LANG,
  theme: Constants.DEFAULT_THEME,
  loadingCount: 0,
  isAuth: auth(),
  user: auth() ? jwt(cookie.get('JWT')) : {}
}

const actionHandlers = {
  [Types.SWITCH_LOCALE]: (_, action) => ({
    locale: action.payload
  }),
  [Types.SWITCH_THEME]: (_, action) => ({
    theme: action.payload
  }),
  [Types.ADD_LOADING]: (state) => ({
    loadingCount: state.loadingCount + 1
  }),
  [Types.REMOVE_LOADING]: (state) => ({
    loadingCount: state.loadingCount > 0 ? state.loadingCount - 1 : 0
  }),
  [Types.REQUEST_LOGIN]: (_, action) => ({
    user: action.payload,
    isAuth: true
  }),
  [Types.REQUEST_LOGOUT]: () => ({
    user: {},
    isAuth: false
  })
}

export default {
  initialState,
  actionHandlers
}