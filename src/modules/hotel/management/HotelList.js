import React from 'react';
import { HOTEL_TYPES } from 'consts';
import { FormattedMessage } from 'react-intl';
import { getAllHotel } from '../HotelServices';
import { Table, Select, Input, Button, Tooltip, Badge } from 'antd';

const PAGE_SIZE = 10;
const Option = Select.Option;

class HotelList extends React.Component {
  state = { content: [], size: PAGE_SIZE, number: 0, totalElements: 0, query: {}, selectedRowKeys: [] }

  columns = getColumns(this)

  fetch = (page = this.state.number, size = this.state.size, query = this.state.query) => {
    return getAllHotel({ page, size, ...query })
      .then((data) => {
        this.setState({ ...data })
      })
  }

  showSizeChanger = (current, pageSize) => {
    this.fetch(current - 1, pageSize);
  }

  componentDidMount() {
    this.fetch();
  }

  onSearchChange = (key) => (e) => {
    this.setState({ query: { ...this.state.query, [key]: e.target ? e.target.value : e } })
  }

  onSearch = () => {
    this.fetch(0);
  }

  onRowSelect = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const { t, tab, provinces } = this.props;
    const { query, selectedRowKeys } = this.state;
    const selectable = tab !== 'ALL_HOTEL';
    const disabledAct = !selectedRowKeys.length;
    return (
      <div className="container-fluid hotel-management">
        <div className="row">
          <div className="col-md-12">
            <div className="table-toolbar">
              <span className="toolbar-left">
                <Select
                  value={query.type}
                  placeholder={t('HOTEL_TYPE')}
                  onChange={this.onSearchChange('type')}>
                  {HOTEL_TYPES.map((op) => {
                    const title = t(op);
                    return (
                      <Option key={op}>
                        <Tooltip title={title}>{title}</Tooltip>
                      </Option>)
                  })}
                </Select>
                <Select
                  value={query.provinceId}
                  placeholder={t('PROVINCE')}
                  onChange={this.onSearchChange('provinceId')}>
                  {provinces.map(({ id, name }) => (
                    <Option key={id}>
                      <Tooltip title={name}>{name}</Tooltip>
                    </Option>))}
                </Select>
                <Input.Search
                  value={query.text}
                  onSearch={this.onSearch}
                  onChange={this.onSearchChange('text')}
                  placeholder={t('SEARCH_HOTEL_PLACEHOLDER')}
                />
                <Button type="primary" onClick={this.onSearch}>
                  <FormattedMessage id="ACT_SEARCH" />
                </Button>
              </span>
              <span className="toolbar-right">
                {tab === 'PENDING_HOTEL' && <Badge count={selectedRowKeys.length}><Button type="primary" disabled={disabledAct}>{t('APPROVE')}</Button></Badge>}
                {tab === 'ACTIVE_HOTEL' && <Badge count={selectedRowKeys.length}><Button type="danger" disabled={disabledAct}>{t('BLOCK')}</Button></Badge>}
                {tab === 'BLOCK_HOTEL' && <Badge count={selectedRowKeys.length}><Button type="dashed" disabled={disabledAct}>{t('UNBLOCK')}</Button></Badge>}
              </span>
            </div>
            <Table
              rowKey="id"
              scroll={{ x: 1600 }}
              pagination={{
                showSizeChanger: true,
                current: this.state.number + 1,
                pageSize: this.state.size,
                total: this.state.totalElements,
                onChange: this.showSizeChanger,
                onShowSizeChange: this.showSizeChanger
              }}
              rowSelection={selectable ? {
                selectedRowKeys,
                onChange: this.onRowSelect
              } : undefined}
              columns={this.columns}
              dataSource={this.state.content} />
            <Button type="dashed">
              <FormattedMessage id="EXPORT_EXCEL" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const getColumns = (self) => ([
  {
    title: <FormattedMessage id="HOTEL_CODE" />,
    dataIndex: 'id',
    width: 75
  },
  {
    title: <FormattedMessage id="HOTEL_NAME" />,
    dataIndex: 'name',
    render: (value) => (<Tooltip title={value}>{value}</Tooltip>)
  },
  {
    title: <FormattedMessage id="HOTEL_TYPE" />,
    dataIndex: 'hotelType',
    width: 150,
    render: (value) => {
      const title = self.props.t(value);
      return (<Tooltip title={title}>{title}</Tooltip>)
    }
  },
  {
    title: <FormattedMessage id="JOIND_DATE" />,
    dataIndex: 'joinDate',
    width: 150,
  },
  {
    title: <FormattedMessage id="ADMINISTRATOR" />,
    dataIndex: 'admin',
    width: 150,
  },
  {
    title: <FormattedMessage id="E-MAIL" />,
    dataIndex: 'email',
    width: 120,
  },
  {
    title: <FormattedMessage id="PHONE_NUM" />,
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: <FormattedMessage id="STATUS" />,
    dataIndex: 'status',
    width: 150,
  },
  {
    title: <FormattedMessage id="DETAIL" />,
    width: 110,
    fixed: 'right',
    render: (item) => (
      <a href="#/">
        <FormattedMessage id="VIEW_DETAIL" />
      </a>
    )
  }
])

export default HotelList