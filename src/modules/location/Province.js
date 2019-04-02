import React from 'react';
import Modal from './ProvinceModal';
import { FormattedMessage } from 'react-intl';
import { getProvinceList, getAllCountry, deleteProvince } from './services';
import { Input, Table, Divider, Button, Popconfirm, message, Select } from 'antd';

const PAGE_SIZE = 10;
const NONE = 'NONE';

class Province extends React.Component {
  state = { modal: false, addMode: true, content: [], size: PAGE_SIZE, number: 0, totalElements: 0, query: { countryId: '_ALL_' }, countries: [] }

  provinceColumns = getProvinceColumns(this)

  t = (id, values) => (this.props.intl.formatMessage({ id }, values))

  fetch = (page = this.state.number, size = this.state.size, query = this.state.query) => {
    return getProvinceList({ page, size, ...query, sort: 'modifiedDate,desc', countryId: query.countryId === '_ALL_' ? undefined : query.countryId })
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
    deleteProvince(item.id)
      .then(() => {
        this.fetch(0);
        message.success(this.t('PROVINCE_DELETE_DONE'))
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
    getAllCountry()
      .then(({ content: countries }) => { this.setState({ countries }) })
    this.fetch();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="bgc-white bd bdrs-3 p-20 mB-20">
            <div className="table-toolbar">
              <span className="toolbar-left"><FormattedMessage id="LIST_OF_CITIES" /></span>
              <span className="toolbar-right">
                <Input.Search onSearch={this.onSearch} placeholder={this.t('SEARCH')} />
                <Select
                  className="dropdown"
                  value={this.state.query.countryId}
                  onChange={this.onChangeCountry}>
                  <Select.Option key={"_ALL_"} value="_ALL_"><FormattedMessage id="ALL" /></Select.Option>
                  {this.state.countries.map(({ name, id }) => (
                    <Select.Option key={id} value={id}>{name}</Select.Option>
                  ))}
                </Select>
                <Button type="primary" onClick={this.openAdd}>
                  <FormattedMessage id="ADD_CITY" />
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
              columns={this.provinceColumns}
              dataSource={this.state.content} />
          </div>
        </div>
        <Modal
          t={this.t}
          data={this.data}
          show={this.state.modal}
          toggle={this.toggleModal}
          addMode={this.state.addMode}
          countries={this.state.countries}
        />
      </div>
    );
  }
}

const getProvinceColumns = (self) => ([
  {
    title: <FormattedMessage id="CITY_NAME" />,
    dataIndex: 'name',
  },
  {
    title: <FormattedMessage id="SLOGAN" />,
    dataIndex: 'slogan',
  },
  {
    title: <FormattedMessage id="DESCRIPTION" />,
    dataIndex: 'introduction',
    width: 200,
    render: (value) => (<div className="text text--3l">{value}</div>)
  },
  {
    title: <FormattedMessage id="ACTION" />,
    key: "city-action",
    width: 128,
    render: (item) => item.name === NONE ? null : (
      <span>
        <a href="/" onClick={self.openEdit.bind(self, item)}>
          <FormattedMessage id="ACT_MODIFY" />
        </a>
        <Divider type="vertical" />
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="PROVINCE_DELETE_CONFIRM" />}
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


export default Province;