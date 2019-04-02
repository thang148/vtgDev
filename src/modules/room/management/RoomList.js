import React from 'react';
import intl, { FormattedMessage } from 'intl';
import { Button, Table, Divider, Popconfirm, Select } from 'antd';

export default intl(class RoomList extends React.Component {
  columns = [{
    title: <FormattedMessage id="ROOM_NAME" />,
    dataIndex: 'name'
  },
  {
    title: <FormattedMessage id="ROOM_TYPE" />,
    dataIndex: 'type'
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
          title={<FormattedMessage id="ROOM_NAME_DELETE_CONFIRM" />}
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
          <span className="toolbar-left"><FormattedMessage id="ROOM_NAME" /></span>
          <span className="toolbar-right">
            <Select placeholder={this.props.t('ROOM_TYPE')} style={{ minWidth: 150 }}>

            </Select>
            <Button type="primary"><FormattedMessage id="ADD_ROOM_NAME" /></Button>
          </span>
        </div>
        <Table dataSource={[]} columns={this.columns} />
      </React.Fragment>)
  }
})