import React from 'react';
import Modal from './PlaceModal';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getPlaceList, removePlace } from './services';
import { Input, Table, Divider, Button, Popconfirm, message } from 'antd';
import './Places.less';

const PAGE_SIZE = 10;

class Places extends React.Component {
  state = { modal: false, addMode: true, content: [], size: PAGE_SIZE, number: 0, totalElements: 0, query: {}, countries: [] }

  columns = getColumns(this)

  t = (id, values) => (this.props.intl.formatMessage({ id }, values))

  fetch = (page = this.state.number, size = this.state.size, query = this.state.query) => {
    return getPlaceList({ page, size, ...query })
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

  onDelete = (item) => {
    removePlace(item.id)
      .then(() => {
        message.success(this.t('PLACE_DELETE_DONE'));
        this.fetch(0)
      })
  }

  onChangeCountry = (value) => {
    this.setState({ query: { ...this.state.query, countryId: value } },
      () => {
        this.fetch(0)
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
            <div className="bgc-white bd bdrs-3 p-20 mB-20">
              <div className="table-toolbar">
                <span className="toolbar-left"><FormattedMessage id="LIST_OF_PLACES" /></span>
                <span className="toolbar-right">
                  <Input.Search onSearch={this.onSearch} placeholder={this.t('SEARCH')} />
                  <Button type="primary" onClick={this.openAdd}>
                    <FormattedMessage id="ADD_PLACE" />
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
            addMode={this.state.addMode}
          />
        </div>
      </div>
    );
  }
}

const getColumns = (self) => ([
  {
    title: <FormattedMessage id="PLACE_NAME" />,
    dataIndex: 'name',
  },
  {
    title: <FormattedMessage id="SLOGAN" />,
    dataIndex: 'slogan',
  },
  {
    title: <FormattedMessage id="DESCRIPTION" />,
    dataIndex: 'description',
  },
  {
    title: <FormattedMessage id="ACTION" />,
    key: "country-action",
    width: 128,
    render: (item) => (
      <span>
        <a href="/" onClick={self.openEdit.bind(self, item)}>
          <FormattedMessage id="ACT_MODIFY" />
        </a>
        <Divider type="vertical" />
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="PLACE_DELETE_CONFIRM" />}
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


export default injectIntl(Places)