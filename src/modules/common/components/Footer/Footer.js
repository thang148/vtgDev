import React from 'react';
import { Layout } from 'antd';

export default class AppFooter extends React.Component {
  render() {
    return (<Layout.Footer>
      <span>Copyright © 2018 Designed by&nbsp;
        <a
          href="https://github.com/viethoavnm"
          title="viethoavnm">viethoavnm
          </a>. All rights reserved.</span>
    </Layout.Footer>);
  }
}