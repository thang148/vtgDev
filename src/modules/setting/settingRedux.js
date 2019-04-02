import * as services from './settingServices';

const SHOW_ERROR = 'SHOW_ERROR';
const HIDE_ERROR = 'HIDE_ERROR';
const SET_PAGE_LIST = 'SET_PAGE_LIST';

const initialState = {
  pageList: {
    content: [],
    number: 0,
    totalPages: 0,
    totalElements: 0
  },
  error: false
}

const actionHandlers = {
  [SHOW_ERROR]: (state) => ({ state, error: true }),
  [HIDE_ERROR]: (state) => ({ state, error: false }),
  [SET_PAGE_LIST]: (state, action) => ({ ...state, pageList: action.payload }),
}

/**
 * =====SETTINGS:LIST OF PAGES====================
 */
export const getPageList = (query) => (dispatch) => {
  services.getPageList(query)
    .then((data) => {
      dispatch({
        type: SET_PAGE_LIST,
        payload: data
      })
    })
    .catch(() => { dispatch({ type: SHOW_ERROR }) })
}

export default {
  initialState,
  actionHandlers
}