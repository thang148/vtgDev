import React from 'react';
import intl, { FormattedMessage } from 'intl';
import { Button, List } from 'antd';

const GRID = { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 };

export default intl(class RoomConvenient extends React.Component {
  onRenderItem = () => {
    return (
      <List.Item>
        Card content
      </List.Item>)
  }

  render() {
    return (
      <React.Fragment>
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="UTILS_AND_DEVICES" /></span>
          <span className="toolbar-right">
            <Button type="primary" onClick={this.onAddUtils}><FormattedMessage id="ADD_UTILS" /></Button>
          </span>
        </div>
        <List
          grid={GRID}
          dataSource={[]}
          renderItem={this.onRenderItem} />
      </React.Fragment>)
  }
})