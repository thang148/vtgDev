import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Popover, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

const AvatarHolder = ({ user }) => {
  const POP_CONTENT = (
    <ul className="user-popover">
      <li>
        <a href="#/user-info">
          <Icon type="user" />
          <FormattedMessage id="USER_INFO" />
        </a>
      </li>
      <li>
        <a href="#/setting">
          <Icon type="setting" />
          <FormattedMessage id="SETTING" />
        </a>
      </li>
      <li>
        <a href="#/sign-out">
          <Icon type="logout" />
          <FormattedMessage id="SIGN_OUT" />
        </a>
      </li>
    </ul>
  )
  return (
    <Popover
      placement="bottomRight"
      content={POP_CONTENT}
      title={<FormattedMessage id="USER_INFO" />}>
      <div className="avatar">
        <span className="avatar__name">{user}</span>
        <Avatar className="avatar__image">{user}</Avatar>
      </div>
    </Popover>
  )
};

export default connect((state) => ({ user: state.common.user.user_name }))(AvatarHolder);