import React from 'react';
import Country from './Country';
import Province from './Province';
import { Divider } from 'antd';
import { injectIntl } from 'react-intl';
import './Location.less';

const LocationWrapper = ({ intl }) => (
  <div className="container-fluid">
    <Country intl={intl} />
    <Divider />
    <Province intl={intl} />
  </div>
)

export default injectIntl(LocationWrapper)