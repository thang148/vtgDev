import React from 'react';
import { Table, Input, Divider, Button, Popconfirm, message, Radio, Icon, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as Services from './services';
import Modal from './UserModal';


const Option = Select.Option;
let timeout;
const DefaultPageSize = 10;
const InputSearch = (props) => (
  <div style={{ padding: 8 }}>
    <Input
      placeholder="Search"
      onChange={e => props.onChangesearchText(props.name, e.target.value)}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
  </div>
)
const getColumns = (props) => ([
  {
    title: <FormattedMessage tedMessage id="ID_USER" />,
    dataIndex: 'id',
  }, {
    title: <FormattedMessage tedMessage id="USERNAME" />,
    dataIndex: 'username',
    filterDropdown: () => (<InputSearch {...props} name="username" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage tedMessage id="BIRTHDAY" />,
    dataIndex: 'dateOfBirth',
  }, {
    title: <FormattedMessage tedMessage id="READ_NAME" />,
    dataIndex: 'fullname',
    filterDropdown: () => (<InputSearch {...props} name="fullname" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage tedMessage id="GENDER" />,
    dataIndex: 'gender',
    filterDropdown: () => (<InputSearch {...props} name="gender" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage id="EMAIL" />,
    dataIndex: 'email',
    filterDropdown: () => (<InputSearch {...props} name="email" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage id="PHONE_NUM" />,
    dataIndex: 'phoneNumber',
    filterDropdown: () => (<InputSearch {...props} name="phoneNumber" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage id="ADDRESS" />,
    dataIndex: 'address',
    filterDropdown: () => (<InputSearch {...props} name="address" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage id="ROLE" />,
    dataIndex: 'role',
    filterDropdown: () => (<InputSearch {...props} name="role" />),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  }, {
    title: <FormattedMessage id="STATUS" />,
    dataIndex: 'status',
    filterDropdown: () => (
      <Select style={{ width: 120 }} placeholder="Search" onChange={(e) => props.onChangesearchText("status", e)}>
        <Option value=""><FormattedMessage id="ALL" /></Option>
        <Option value="ACTIVE"><FormattedMessage id="OPEN" /></Option>
        <Option value="INACTIVE"><FormattedMessage id="CLOSE" /></Option>
      </Select>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    render: (item) => (
      <span>{item === "ACTIVE" ? <FormattedMessage tedMessage id="ACTIVE" /> : <FormattedMessage tedMessage id="INACTIVE" />}</span>
    )
  }, {
    title: <FormattedMessage id="DETAIL" />,
    dataIndex: 'detail',
  }, {
    title: <FormattedMessage id="ACTION" />,
    key: "city-action",
    width: 128,
    render: (item) => (
      <span>
        <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={props.showModalEdit.bind(props, item)}>
          <FormattedMessage id="ACT_MODIFY" />
        </span>
        <Divider type="vertical" />
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="PROVINCE_DELETE_CONFIRM" />}
          onConfirm={props.onDelete.bind(props, item)}
          okText={<FormattedMessage id="ACT_DELETE" />}
          cancelText={<FormattedMessage id="ACT_CANCEL" />}
        >
          <a href="/"><FormattedMessage id="ACT_DELETE" /></a>
        </Popconfirm>
      </span>
    )
  }
]);
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};

class Management extends React.Component {
  t = (id, values) => (this.props.intl.formatMessage({ id }, values))
  state = {
    showModal: false,
    isUpdate: false,
    size: DefaultPageSize,
    number: 1,
    totalElements: 0,
    content: [],
    customer: true,
  }
  dataSearch = {};
  fetch = (dataSearch = this.dataSearch, pageNo = this.state.number, pageSize = this.state.size, customer = this.state.customer) => {
    Services.getAllUser({ ...dataSearch, pageNo, pageSize, customer }).then((data) => {
      this.setState({ ...data });
    }).catch(() => { })
  }
  columns = getColumns(this);

  onSearch = () => { }
  onDelete = (item, e) => {
    e.preventDefault();
    Services.DeleteUser(item.id).then(() => {
      message.success(this.t("SUCCESSFULLY"));
      this.fetch();
    }).catch(() => {
      message.error(this.t("ERROR"));
    })
  }

  toggle = () => {
    this.setState({ showModal: !this.state.showModal, });
  }

  showModalAdd = () => {
    this.setState({
      addMode: true,
      showModal: !this.state.showModal,
    });
  }

  showModalEdit = (item, e) => {
    e.preventDefault();
    this.data = { ...item }
    this.setState({
      addMode: false, showModal: true,
    });
  }
  showSizeChanger = (current, pageSize) => {
    this.fetch(this.dataSearch, current, pageSize);
  }
  onChangePage = (e) => {
    this.setState({ customer: e.target.value }, () => {
      this.fetch();
    });
  }
  componentDidMount() {
    this.fetch();
  }

  onChangesearchText = (key, value) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    this.dataSearch = {
      ...this.dataSearch,
      [key]: value ? value : null
    }
    const { size, customer } = this.state;
    const data = {
      ...this.dataSearch, pageNo: null, pageSize: size ? size : DefaultPageSize, customer
    }
    timeout = setTimeout(() => {
      Services.getAllUser({ ...data }).then((data) => {
        this.setState({ ...data });
      }).catch(() => { })
    }, 500);
  }

  render() {
    const { showModal, addMode, content, customer } = this.state;
    return (
      <div className="container-fluid">
        <Radio.Group value={customer} onChange={this.onChangePage}>
          <Radio.Button value={false}><FormattedMessage id="ADMIN_MANAGEMENT" /></Radio.Button>
          <Radio.Button value={true}><FormattedMessage id="CUSTOMER_MANAGEMENT" /></Radio.Button>
        </Radio.Group>
        <div className="table-toolbar">
          <div className="toolbar-left">
            <span style={{ fontWeight: '700' }}><FormattedMessage id={!customer ? "LIST_ACOUNT_ADMIN" : "LIST_ACOUNT_CUSTOMER"} /></span>
          </div>
          <div className="toolbar-right">
            <Input.Search onSearch={this.onSearch} placeholder={this.t("SEARCH")} />
            <Button type="primary" onClick={this.showModalAdd}>
              <FormattedMessage id="ADD_USER" />
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={content}
          pagination={{
            onShowSizeChange: this.showSizeChanger,
            total: this.state.totalElements,
            current: this.state.number + 1,
            showSizeChanger: true,
            onChange: this.showSizeChanger,
            pageSize: this.state.size
          }}
          rowSelection={rowSelection}
        />
        <Modal
          t={this.t}
          showModal={showModal}
          toggle={this.toggle}
          updateTable={this.fetch}
          addMode={addMode}
          data={this.data}
        />
      </div>
    );
  }
}

export default injectIntl(Management);
