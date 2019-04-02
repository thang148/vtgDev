import React from 'react';
import ReactDOM from 'react-dom';
import ReduxWrapper from './reduxModule';
import Router from './routerModule';
import LocaleProvider from './utils/locales';
import registerServiceWorker from './utils/registerServiceWorker';

/**
 * Start the app
 */
(function stating() {
  const App = () => (
    <ReduxWrapper>
      <LocaleProvider>
        <Router />
      </LocaleProvider>
    </ReduxWrapper>
  );
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
})();
