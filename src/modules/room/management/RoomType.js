import React from 'react';
import intl, { FormattedMessage } from 'intl';
import { Button, Table, Divider, Popconfirm } from 'antd';

export default intl(class RoomType extends React.Component {
  columns = [{
    title: <FormattedMessage id="ROOM_TYPE" />,
    dataIndex: 'name'
  },
  {
    title: <FormattedMessage id="ACTION" />,
    dataIndex: 'id',
    width: 128,
    render: (id) => (
      <span>
        <a href="/">
          <FormattedMessage id="ACT_MODIFY" />
        </a>
        <Divider type="vertical" />
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="ROOM_TYPE_DELETE_CONFIRM" />}
          okText={<FormattedMessage id="ACT_DELETE" />}
          cancelText={<FormattedMessage id="ACT_CANCEL" />}>
          <a href="/"><FormattedMessage id="ACT_DELETE" /></a>
        </Popconfirm>
      </span>
    )
  }]
  render() {
    return (
      <React.Fragment>
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="HOTEL_ROOM_TYPE" /></span>
          <span className="toolbar-right">
            <Button type="primary" onClick={this.onAddUtils}><FormattedMessage id="ADD_ROOM_TYPE" /></Button>
          </span>
        </div>
        <Table dataSource={[]} columns={this.columns} />
      </React.Fragment>)
  }
})