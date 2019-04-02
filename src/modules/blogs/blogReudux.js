import * as services from './BlogServices';

const INIT_CATEGROIES = 'INIT_CATEGROIES';
const SHOW_ERROR = 'SHOW_ERROR';
const HIDE_ERROR = 'HIDE_ERROR';
const SET_POST = 'SET_POST';
const SET_BLOG_LIST = 'SET_BLOG_LIST';
const PLACE_LIST = 'PLACE_LIST';

const initialState = {
  categories: [],
  places: [],
  post: {},
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
  [INIT_CATEGROIES]: (state, action) => ({ ...state, categories: action.payload }),
  [SET_POST]: (state, action) => ({ ...state, post: action.payload }),
  [SET_BLOG_LIST]: (state, action) => ({ ...state, list: action.payload }),
  [PLACE_LIST]: (state, action) => ({ ...state, places: action.payload })
}

/**
 * ======BLOG:PUBLIC CATEGORY
 */
export const initCategories = () => (dispatch, getState) => {
  if (!getState().blog.categories.length)
    services.getBlogCategories()
      .then(({ content }) => {
        dispatch({
          type: INIT_CATEGROIES,
          payload: content
        })
      })
      .catch(() => { dispatch({ type: SHOW_ERROR }) })
}

/**
 * ======BLOG:BLOG========================
 */
export const setPost = (post) => ({
  type: SET_POST,
  payload: post
})

export const getPost = (id) => (dispatch) => {
  services.getBlog(id)
    .then((post) => {
      dispatch(setPost(post));
    })
    .catch(() => { dispatch({ type: SHOW_ERROR }) })
}

/**
 * =====BLOG:LIST POST====================
 */
export const getBlogList = (query) => (dispatch) => {
  services.getBlogList(query)
    .then((data) => {
      dispatch({
        type: SET_BLOG_LIST,
        payload: data
      })
    })
    .catch(() => { dispatch({ type: SHOW_ERROR }) })
}

/**
 * =====BLOG: LIST PLACES=====================
 */
export const getPlacesList = (query) => (dispatch) => {
  services.getPlaceList(query)
    .then(({ content: data }) => {
      dispatch({
        type: PLACE_LIST,
        payload: data
      })
    })
    .catch(() => { dispatch({ type: SHOW_ERROR }) })
}

export default {
  initialState,
  actionHandlers
}