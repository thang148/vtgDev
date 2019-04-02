import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getBlogList, deleteBlog, updateStatus, deleteManyBlog } from '../BlogServices';
import { initCategories, setPost } from '../blogReudux';
import {
  message,
  Modal,
  Popconfirm,
  Select,
  Button,
  Input,
  Divider,
  Table,
  Tooltip
} from 'antd';

const Option = Select.Option;
const STATUS_PUBLIC = 'PUBLISHED';
const STATUS_PRIVATE = 'DRAFT';
const PAGE_SIZE = 10;

class BlogWrapper extends React.PureComponent {
  state = { selected: [], content: [], size: PAGE_SIZE, number: 0, totalElements: 0, query: { categoryId: '_ALL_' } }

  columns = getColumns(this)

  t = (id, values) => (this.props.intl.formatMessage({ id }, values))

  fetch = (page = this.state.number, size = this.state.size, query = this.state.query) => {
    return getBlogList({
      page,
      size,
      sort: 'modifiedDate,desc',
      key: query.key ? query.key.trim() : undefined,
      categoryId: query.categoryId === '_ALL_' ? undefined : query.categoryId
    })
      .then((data) => {
        this.setState({ ...data, selected: [] });
      })
      .catch(() => { message.error(this.t('ERROR')) })
  }

  onOpenAdd = () => { this.props.history.push('/blog/write') }

  onOpenModify = (item, e) => {
    e.preventDefault();
    this.props.setPost(item);
    this.props.history.push(`/blog/modify?post=${item.id}`)
  }

  onChangeStatus = ({ id }, value) => {
    updateStatus(id, value)
      .then(() => {
        message.success(this.t('POST_UPDATE_DONE'))
        this.fetch()
      })
      .catch(() => {
        message.error(this.t('BLOG_UPDATE_STATUS_FAIL'))
      })
  }

  onDelete = ({ id }) => {
    deleteBlog(id)
      .then(() => {
        message.success(this.t('BLOG_DELETE_DONE'));
        this.fetch();
      })
      .catch(this.showError)
  }

  onDeleteSelected = () => {
    Modal.confirm({
      title: this.t('POST_DELETE_SELECTED'),
      okText: this.t('ACT_DELETE'),
      cancelText: this.t('ACT_CANCEL'),
      onOk: () => {
        deleteManyBlog(this.state.selected.map(({ id }) => (id)).toString())
          .then(() => {
            this.fetch(0);
            message.success(this.t('BLOG_DELETE_DONE'));
            this.setState({ selected: [] })
          })
          .catch(() => {
            message.warning(this.t('ERROR'))
          })
      }
    });
  }

  onChangeStatusSelected = (e) => {
    Modal.confirm({
      title: this.t('POST_UPDATE_STATUS_CONFIRM'),
      okText: this.t('ACT_SAVE'),
      cancelText: this.t('ACT_CANCEL'),
      onOk: () => {
        updateStatus(this.state.selected.map(({ id }) => (id)).toString(), e)
          .then(() => {
            this.fetch();
            message.success(this.t('POST_UPDATE_DONE'));
          })
          .catch(() => {
            message.warning(this.t('BLOG_UPDATE_STATUS_FAIL_MANY'))
          })
      }
    });
  }

  onSelection = (_, selectedRows) => {
    this.setState({ selected: selectedRows });
  }

  showError = () => {
    message.error(this.t('ERROR'));
  }

  onChangeCategory = (value) => {
    this.setState({ query: { ...this.state.query, categoryId: value } },
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
    this.props.initCategories();
    this.fetch();
  }

  render() {
    const { categories } = this.props;
    const { content, selected } = this.state;
    const showNumber = selected && selected.length ? true : false;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-toolbar">
              <span className="toolbar">
                <Select
                  style={{ minWidth: 200 }}
                  onChange={this.onChangeCategory}
                  value={this.state.query.categoryId}
                  placeholder={this.t('SELECT_BLOG_CATEGORY')}>
                  <Select.Option key={"_ALL_"} value="_ALL_"><FormattedMessage id="ALL" /></Select.Option>
                  {categories.map(category => (<Option key={category.id} value={category.id}><Tooltip title={category.title}>{category.title}</Tooltip></Option>))}
                </Select>
                <Input.Search
                  placeholder={this.t('SEARCH')}
                  ref={(ref) => { this.search = ref }}
                  onSearch={this.onSearch} />
                <Button type="primary" onClick={() => { this.search.onSearch() }}><FormattedMessage id="ACT_SEARCH" /></Button>
              </span>
              <span className="toolbar-right">
                <span className="toolbar">
                  <Select
                    style={{ width: 110 }}
                    disabled={!showNumber}
                    onChange={this.onChangeStatusSelected}>
                    <Option value={STATUS_PUBLIC}><FormattedMessage id="PUBLIC" /></Option>
                    <Option value={STATUS_PRIVATE}><FormattedMessage id="PRIVATE" /></Option>
                  </Select>
                  <Button type="danger" onClick={this.onDeleteSelected} disabled={!showNumber}>
                    <FormattedMessage id="ACT_DELETE" />
                    {showNumber && <span> ( {selected.length} )</span>}
                  </Button>
                  <Button type="primary" onClick={this.onOpenAdd} disabled={!!showNumber}>
                    <FormattedMessage id="ADD_BLOG" />
                  </Button>
                </span>
              </span>
            </div>
            <Table
              rowKey="id"
              rowSelection={{ onChange: this.onSelection }}
              columns={this.columns}
              pagination={{
                showSizeChanger: true,
                current: this.state.number + 1,
                pageSize: this.state.size,
                total: this.state.totalElements,
                onChange: this.showSizeChanger,
                onShowSizeChange: this.showSizeChanger
              }}
              dataSource={content} />
          </div>
        </div>
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
    render: (value) => (moment(value).format('DD/MM/YYYY')),
    width: 128,
  },
  {
    title: <FormattedMessage id="TBL_STATUS" />,
    key: 'status',
    width: 120,
    render: (item) =>
      (
        <Select
          value={item.status}
          style={{ width: 110 }}
          onChange={self.onChangeStatus.bind(self, item)}>
          <Option value={STATUS_PUBLIC}><FormattedMessage id="PUBLIC" /></Option>
          <Option value={STATUS_PRIVATE}><FormattedMessage id="PRIVATE" /></Option>
        </Select>
      )
  },
  {
    title: <FormattedMessage id="ACTION" />,
    key: "country-action",
    width: 148,
    render: (item) => (
      <span>
        <Link to={`/blog/preview/${item.id}`}>
          <FormattedMessage id="ACT_SHOW" />
        </Link>
        <Divider type="vertical" />
        <a href="/modify"
          onClick={self.onOpenModify.bind(self, item)}>
          <FormattedMessage id="ACT_MODIFY" />
        </a>
        <Divider type="vertical" />
        <Popconfirm
          placement="topRight"
          title={<FormattedMessage id="BLOG_DELETE_POST" />}
          onConfirm={self.onDelete.bind(self, item)}
          okText={<FormattedMessage id="ACT_DELETE" />}
          cancelText={<FormattedMessage id="ACT_CANCEL" />}
        >
          <a href="/delete"><FormattedMessage id="ACT_DELETE" /></a>
        </Popconfirm>
      </span>
    )
  }
])

const mapState = (state) => ({
  categories: state.blog.categories
})

const mapDispatch = {
  initCategories,
  setPost
}
export default withRouter(injectIntl(connect(mapState, mapDispatch)(BlogWrapper)))