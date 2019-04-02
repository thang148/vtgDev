import React from 'react';
import { Icon, Layout } from 'antd';
import PATH from 'routerModule/path';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import Avatar from './Avatar';

class AppHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setBreadCrumb(nextProps.location.pathname, nextProps.intl.formatMessage);
  }

  setBreadCrumb = (pathname, formatMessage) => {
    PATH.forEach((menu) => {
      if (menu.subComponent) {
        menu.subComponent.forEach((sub) => {
          if (sub.url === pathname) {
            const title = formatMessage({ id: sub.title });
            document.title = title + ' - www.viettrago.vn - Administrator';
            this.setState({ icon: menu.icon, title });
            return;
          }
        });
      } else {
        if (menu.url === pathname) {
          const title = formatMessage({ id: menu.title });
          document.title = title + ' - www.viettrago.vn - Administrator';
          this.setState({ icon: menu.icon, title });
          return;
        }
      }
    })
  }

  componentDidMount() {
    this.setBreadCrumb(this.props.location.pathname, this.props.intl.formatMessage);
  }

  render() {
    const { icon, title } = this.state;
    return (
      <Layout.Header className="header">
        <ul className="header__left">
          <li className="header__title">
            {icon && <Icon type={icon} />}
            <span>{title}</span>
          </li>
        </ul>
        <ul className="header__right">
          <li><Avatar /></li>
        </ul>
      </Layout.Header >
    )
  }
}

export default withRouter(injectIntl(AppHeader));