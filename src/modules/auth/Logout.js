import React from 'react';
import { Redirect } from 'react-router-dom';
import Common from '../common';

const Logout = () => {
  Common.Actions.requestLogout();
  return <Redirect to="/login" />
}

export default Logout;