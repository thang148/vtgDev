import React from 'react';
import Modal from './UtilsModal';
import { Table, Input, Select } from 'antd';
import injectIntl, { FormattedMessage } from 'intl';
import * as Services from './sevices';
import TableService from './TableService';

const Option = Select.Option;
const PATH = "https://spetrip.com/vtg/resources/";
// const GRID = { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 };
const DefaultPageSize = 10;

const GetColumns = (props) => ([{
  title: <FormattedMessage tedMessage id="DESCRIPTION" />,
  dataIndex: 'description'
}, {
  title: <FormattedMessage tedMessage id="ICON" />,
  dataIndex: 'icon',
  render: (name) => (<img key={name} alt={name} src={PATH + name} style={stylesImage} />)
}, {
  title: <FormattedMessage tedMessage id="STATUS" />,
  dataIndex: 'status',
  render: (item) => (
    <span>{item ? <FormattedMessage tedMessage id="OPEN" /> : <FormattedMessage tedMessage id="CLOSE" />}</span>
  )
}, {
  title: <FormattedMessage id="ACTION" />,
  key: "city-action",
  width: 128,
  align: 'center',
  render: (item) => (
    <span>
      <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={props.showModalEdit.bind(props, item)}>
        <FormattedMessage id="ACT_MODIFY" />
      </span>
    </span>
  )
}
]);

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};

export default injectIntl(class HotelUtilsAndServices extends React.Component {
  state = { modal: false, size: DefaultPageSize, number: 1, totalElements: 0, content: [] }
  fetch = (pageNo = this.state.number, pageSize = this.state.size, type = "HOTEL_CONVENTIENT") => {
    Services.getAllUtils({ pageNo, pageSize, type }).then((data) => {
      this.setState({ ...data });
    }).catch(() => { })
  }
  columns = GetColumns(this);
  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  showModalEdit = (item, e) => {
    e.preventDefault();
    this.data = { ...item };
    this.setState({ modal: true })
  }

  showSizeChanger = (current, pageSize) => {
    this.fetch(current, pageSize);
  }

  componentDidMount() {
    this.fetch();
  }
  onSearch = () => {
  }
  handleChangeUtils = () => {

  }
  handleChangeService = () => {

  }
  render() {
    const { content, modal } = this.state;
    return (
      <div className="container-fluid hotel-utils-and-services">
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="UTILS" /></span>
          <div className="toolbar-right">
            <Input.Search onSearch={this.onSearch} placeholder={this.props.t("SEARCH_UTILS")} />
            <Select defaultValue={this.props.t("OPEN")} style={{ width: 150 }} onChange={this.handleChangeUtils}>
              <Option value="true"><FormattedMessage id="OPEN" /></Option>
              <Option value="false"><FormattedMessage id="CLOSE" /></Option>
            </Select>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={content}
          rowSelection={rowSelection}
          pagination={{
            pageSize: this.state.size,
            showSizeChanger: true,
            current: this.state.number + 1,
            total: this.state.totalElements,
            onChange: this.showSizeChanger,
            onShowSizeChange: this.showSizeChanger
          }}
        />

        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="SERVICES" /></span>
          <span className="toolbar-right">
            <Input.Search onSearch={this.onSearch} placeholder={this.props.t("SEARCH_SERVICE")} />
            <Select defaultValue={this.props.t("OPEN")} style={{ width: 150 }} onChange={this.handleChangeService}>
              <Option value="true"><FormattedMessage id="OPEN" /></Option>
              <Option value="false"><FormattedMessage id="CLOSE" /></Option>
            </Select>
          </span>
        </div>

        <TableService />

        <Modal
          fetch={this.fetch}
          t={this.props.t}
          visible={modal}
          isUtils={true}
          data={this.data}
          toggle={this.toggle} />
      </div>)
  }
})

const stylesImage = {
  width: "64px",
  height: "36px",
  objectfit: "cover",
  overflow: "hidden",
}