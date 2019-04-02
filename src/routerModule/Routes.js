import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Modules from '../modules';
import ROUTES, { REDIRECT_URL } from './path';
import { store } from '../reduxModule';

const Routes = () => {
  const { isAuth } = store.getState().common;
  if (!isAuth) {
    return (<Switch>
      <Route path="/login" component={Modules.Login} />
      <Redirect to="/login" />
    </Switch>)
  }
  const routes = [];
  ROUTES.forEach((route) => {
    if (route.subComponent)
      route.subComponent.forEach((subRoute) => {
        if (subRoute.props) {
          const Element = Modules[subRoute.component];
          routes.push(<Route exact key={subRoute.url} path={subRoute.url} render={() => <Element {...subRoute.props} />} />);
        }
        else
          routes.push(<Route exact key={subRoute.url} path={subRoute.url} component={Modules[subRoute.component]} />);
      })
    else
      if (route.props) {
        const Element = Modules[route.component];
        routes.push(<Route exact key={route.url} path={route.url} render={() => <Element {...route.props} />} />);
      }
      else
        routes.push(<Route exact key={route.url} path={route.url} component={Modules[route.component]} />);

  });
  return (<Modules.Layout>
    <Switch>
      {routes}
      <Redirect to={REDIRECT_URL} />
    </Switch>
  </Modules.Layout>);
}

export default Routes;