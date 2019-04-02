
const SHOW_ERROR = 'SHOW_ERROR';
const HIDE_ERROR = 'HIDE_ERROR';
const GET_HOTEL = 'GET_HOTEL';
const GET_HOTEL_LIST = 'GET_HOTEL_LIST';

const initialState = {
  hotel: {},
  list: {
    content: [],
    number: 0,
    totalPages: 0,
    totalElements: 0
  },
  error: false,
}

const actionHandlers = {
  [SHOW_ERROR]: (state) => ({ state, error: true }),
  [HIDE_ERROR]: (state) => ({ state, error: false }),
  [GET_HOTEL]: (state, action) => ({ ...state, post: action.payload }),
  [GET_HOTEL_LIST]: (state, action) => ({ ...state, list: action.payload }),
}

/**
 * ======BLOG:PUBLIC CATEGORY
 */


export default {
  initialState,
  actionHandlers
}