/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import create from '../utils/createReducer';
import commonReducer from '../modules/common/redux/reducer';
import blogReducer from '../modules/blogs/blogReudux';
import settingsReducer from '../modules/setting/settingRedux';
import hotelReducer from '../modules/hotel/HotelRedux';

const common = create(commonReducer);
const blog = create(blogReducer);
const settings = create(settingsReducer);
const hotel = create(hotelReducer);

export default combineReducers({
  common,
  settings,
  blog,
  hotel
});
