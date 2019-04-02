/**
 * Create the store with dynamic reducers
 */
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Reducer } from '../reduxModule';

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares

  const enhancers = [applyMiddleware(ReduxThunk)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
      typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false
      })
      : compose;
  /* eslint-enable */

  const store = createStore(
    Reducer,
    composeEnhancers(...enhancers)
  );

  // Extensions
  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('../reduxModule/reducer', () => {
      store.replaceReducer(Reducer);
    });
  }
  return store;
}
