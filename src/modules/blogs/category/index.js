import React from 'react';
import moment from 'moment';
import Modal from './CategoryModal';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getBlogCategories, modifyCategory, deleteCategory } from '../BlogServices';
import { Input, Table, Select, Button, Divider, message, Popconfirm } from 'antd';

const Option = Select.Option;
const STATUS_PUBLIC = 1;
const STATUS_PRIVATE = 0;
const PAGE_SIZE = 10;
const NONE = 'NONE';

class CategoryWrapper extends React.PureComponent {
  state = { modal: false, addMode: true, content: [], size: PAGE_SIZE, number: 0, totalElements: 0, query: {}, countries: [] }

  columns = getColumns(this)

  t = (id, values) => (this.props.intl.formatMessage({ id }, values))

  fetch = (page = this.state.number, size = this.state.size, query = this.state.query) => {
    return getBlogCategories({ page, size, ...query })
      .then((data) => {
        this.setState({ ...data });
      })
      .catch(() => { message.error(this.t('ERROR')) })
  }

  toggleModal = () => {
    if (this.state.modal) {
      this.fetch()
    }
    this.setState({ modal: !this.state.modal })
  }

  openAdd = () => {
    this.data = null;
    this.setState({ addMode: true })
    this.toggleModal();
  }

  openEdit = (item, e) => {
    e.preventDefault();
    this.data = { ...item };
    this.setState({ addMode: false })
    this.toggleModal();
  }

  onChangeStatus = (item, value) => {
    modifyCategory({ ...item, status: value })
      .then(() => { this.fetch(0) })
  }

  onDelete = (item) => {
    deleteCategory(item.id)
      .then(() => {
        this.fetch(0)
        message.success(this.t('CATEGORY_DELETE_DONE'))
      })
  }

  onSearch = (value) => {
    this.setState({ query: { ...this.state.query, key: value } },
      () => {
        this.fetch(0)
      })
  }

  showSizeChanger = (current, pageSize) => {
    this.fetch(current - 1, pageSize);
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-toolbar">
              <span className="toolbar">
                <Input.Search
                  placeholder={this.t('SEARCH')}
                  ref={(ref) => { this.search = ref }}
                  onSearch={this.onSearch} />
                <Button type="primary" onClick={() => { this.search.onSearch() }}><FormattedMessage id="ACT_SEARCH" /></Button>
              </span>
              <span className="toolbar-right">
                <Button type="primary" onClick={this.openAdd}>
                  <FormattedMessage id="ADD_CATEGORY" />
                </Button>
              </span>
            </div>
            <Table
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                current: this.state.number + 1,
                pageSize: this.state.size,
                total: this.state.totalElements,
                onChange: this.showSizeChanger,
                onShowSizeChange: this.showSizeChanger
              }}
              columns={this.columns}
              dataSource={this.state.content} />
          </div>
        </div>
        <Modal
          t={this.t}
          data={this.data}
          show={this.state.modal}
          toggle={this.toggleModal}
          addMode={this.state.addMode} />
      </div>
    )
  }
}

const getColumns = (self) => ([
  {
    title: <FormattedMessage id="TBL_TITLE" />,
    dataIndex: 'title',
  },
  {
    title: <FormattedMessage id="TBL_UPDATE_DATE" />,
    dataIndex: 'modifiedDate',
    width: 130,
    render: (value) => (<span>{value ? moment(value).format('DD/MM/YYYY') : ' - '}</span>)
  },
  {
    title: <FormattedMessage id="TBL_STATUS" />,
    key: 'status',
    width: 130,
    render: (item) =>
      (
        <Select value={item.status} onChange={self.onChangeStatus.bind(self, item)} style={{ width: 110 }}>
          <Option value={STATUS_PUBLIC}><FormattedMessage id="PUBLIC" /></Option>
          <Option value={STATUS_PRIVATE}><FormattedMessage id="PRIVATE" /></Option>
        </Select>
      )
  },
  {
    title: <FormattedMessage id="ACTION" />,
    key: "country-action",
    width: 128,
    render: (item) => item.title === NONE ? null : (
      <span>
        <a href="/" onClick={self.openEdit.bind(self, item)}>
          <FormattedMessage id="ACT_MODIFY" />
        </a>
        <Divider type="vertical" />
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="CATEGORY_DELETE_CONFIRM" />}
          onConfirm={self.onDelete.bind(self, item)}
          okText={<FormattedMessage id="ACT_DELETE" />}
          cancelText={<FormattedMessage id="ACT_CANCEL" />}
        >
          <a href="/"><FormattedMessage id="ACT_DELETE" /></a>
        </Popconfirm>
      </span>
    )
  }
])

export default injectIntl(CategoryWrapper)