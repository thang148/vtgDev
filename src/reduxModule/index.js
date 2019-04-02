import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../utils/configureStore';

export const store = configureStore();

const ReduxWrapper = ({ children }) =>
  (<Provider store={store}>
    {React.Children.only(children)}
  </Provider>);

export default ReduxWrapper;
export { default as Reducer } from './reducer';