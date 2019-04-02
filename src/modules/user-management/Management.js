import React from 'react';
import { Table, Input, Divider, Button, Popconfirm, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as Services from './services';
import Modal from './UserModal';

const DefaultPageSize = 8;
const ListRole = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Content Maneger', value: 'CONTENT_MANAGER' },
  { label: 'Provider', value: 'PROVIDER' },
  { label: 'Soccial_User', value: 'SOCIAL_USER' },
  { label: 'User', value: 'USER' }
]
const getColumns = (props) => ([{
  title: <FormattedMessage tedMessage id="USERNAME" />,
  dataIndex: 'username',
}, {
  title: <FormattedMessage id="EMAIL" />,
  dataIndex: 'email',
}, {
  title: <FormattedMessage id="ROLE" />,
  dataIndex: 'role',
}, {
  title: <FormattedMessage id="PHONE_NUM" />,
  dataIndex: 'phoneNumber',
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

const dState = () => ({
  username: '',
  password: '',
  email: '',
  phoneNumber: '',
  role: ListRole[0].value,
  status: ''
})

class Management extends React.Component {

  t = (id, values) => (this.props.intl.formatMessage({ id }, values))
  state = {
    dataTable: [],
    showModal: false,
    isUpdate: false,
    selected: dState()
  }

  columns = getColumns(this);

  updateTable = () => {
    Services.getAllUser().then((data) => {
      if (data)
        this.setState({ dataTable: data.content });
    })
  }


  onSearch = () => { }

  onDelete = (item, e) => {
    e.preventDefault();
    Services.DeleteUser(item.id).then(() => {
      message.success(this.t("SUCCESSFULLY"));
      this.updateTable();
    }).catch(() => {
      message.error(this.t("ERROR"));
    })
  }

  toggle = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  showModalAdd = () => {
    this.setState({
      addMode: true,
      showModal: !this.state.showModal,
    });
  }

  showModalEdit = (item, e) => {
    e.preventDefault();
    this.setState({ selected: { ...item } }, () => {
      this.setState({
        addMode: false,
        showModal: true,
      });
    });
  }

  componentDidMount() {
    this.updateTable();
  }

  render() {
    const { dataTable, showModal, selected, addMode } = this.state;
    return (
      <div className="container-fluid">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <span style={{ fontWeight: '700' }}><FormattedMessage id="LIST_ACOUNT" /></span>
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
          dataSource={dataTable}
          pagination={{ pageSize: DefaultPageSize }}
        />
        <Modal
          t={this.t}
          showModal={showModal}
          toggle={this.toggle}
          updateTable={this.updateTable}
          addMode={addMode}
          data={selected}
        />
      </div>
    );
  }
}

export default injectIntl(Management);
