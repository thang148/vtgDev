import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'intl';
import * as services from './settingServices';
import { getPageList } from './settingRedux';
import { Table, Divider, Button, Popconfirm } from 'antd';
import { RESOURCES_PATH } from '../common/constants';
import Update from './UpdatePageInfo';
import './Settings.less';

const DEFAULT_PAGE_SIZE = 10;

class PageInfo extends React.PureComponent {
  state = {
    addMode: false,
    modal: false
  }

  columns = [
    {
      title: <FormattedMessage id="PLACE_NAME" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="ASSETS" />,
      dataIndex: 'contentNames',
      render: (values) => (values.map((name) => (<img key={name} alt={name} src={RESOURCES_PATH + name} className="tbl__img--preview" />)))
    },
    {
      title: <FormattedMessage id="DESCRIPTION" />,
      dataIndex: 'description',
    },
    {
      title: <FormattedMessage id="ACTION" />,
      key: "action",
      width: 128,
      render: (item) => (
        <span>
          <a href="/" onClick={this.onUpdate.bind(this, item)}>
            <FormattedMessage id="ACT_MODIFY" />
          </a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topRight"
            title={<FormattedMessage id="DELETE_CONFIRM" />}
            onConfirm={this.onRemove.bind(this, item)}
            okText={<FormattedMessage id="ACT_DELETE" />}
            cancelText={<FormattedMessage id="ACT_CANCEL" />}
          >
            <a href="/"><FormattedMessage id="ACT_DELETE" /></a>
          </Popconfirm>
        </span>
      )
    }
  ];

  onAdd = () => {
    this.data = {};
    this.setState({ modal: true, addMode: true })
  }

  onUpdate = (item, e) => {
    e.preventDefault();
    this.data = item;
    this.setState({ modal: true, addMode: false })
  }

  onRemove = ({ id }, e) => {
    e.preventDefault();
    services.removePage(id);
  }

  fetch = (pageSize = DEFAULT_PAGE_SIZE) => {
    this.props.getPageList({ pageSize });
  }

  componentDidMount() {
    this.fetch();
  }

  onHide = () => {
    this.setState({ modal: false })
    this.fetch();
  }

  render() {
    const { list } = this.props;
    const { modal, addMode } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-toolbar">
              <span className="toolbar-left"><FormattedMessage id="LIST_OF_PAGES" /></span>
              <span className="toolbar-right">
                <Button type="primary" onClick={this.onAdd}>
                  <FormattedMessage id="ADD_PAGE" />
                </Button>
              </span>
            </div>
            <Table rowKey="id" columns={this.columns} dataSource={list.content} />
          </div>
        </div>
        <Update
          visible={modal}
          addMode={addMode}
          onHide={this.onHide}
          data={this.data} />
      </div>
    )
  }
};

const mapState = (state) => ({
  list: state.settings.pageList
})
export default connect(mapState, { getPageList })(PageInfo);