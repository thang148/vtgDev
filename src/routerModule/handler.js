import { withRouter } from 'react-router-dom';

const Router = ({ location }) => {
  switch (location.pathname) {
    default:
      break;
  }
  console.log(">", location.pathname);
  return (null);
}

export default withRouter(Router);