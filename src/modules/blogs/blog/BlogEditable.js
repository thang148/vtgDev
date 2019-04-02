import React from 'react';
import injectIntl from 'intl';
import Tags from 'components/Tags';
import { connect } from 'react-redux';
import Upload from 'components/Upload';
import Editor from 'components/RichEditor';
import Prompt from 'components/Prompt';
import { getBlog, modifyBlog, createBlog } from '../BlogServices';
import { Input, Form, Button, Divider, Icon, Select, message, Modal } from 'antd';
import { RESOURCES_PATH } from 'consts';

const STATUS_PUBLIC = 'PUBLISHED';
const STATUS_PRIVATE = 'DRAFT';
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const MAX_UPLOAD_SIZE = 3 * 1024 * 1024;

class Blog extends React.Component {
  state = { content: '', tagList: [], error: false, unblock: false }
  t = (id, values) => (this.props.intl.formatMessage({ id }, values))

  onContentChange = (content) => {
    this.setState({ content, error: false, unblock: false })
  }

  onTagChange = (tagList) => {
    this.setState({ tagList, unblock: false })
  }

  onSaveDraft = (noModal) => {
    const values = this.props.form.getFieldsValue();
    this.submit({
      ...values,
      ...this.state, bannerContentName:
        values.bannerContentName && !!values.bannerContentName.length
          ? values.bannerContentName[0].response.name
          : null
    }, false, noModal)
  }

  onSubmit = () => {
    this.props.form.validateFields((error, values) => {
      if (!error && this.state.content.length > 300) {
        this.submit({
          ...values,
          ...this.state,
          bannerContentName: values.bannerContentName[0].response.name
        }, true, true)
      } else if (this.state.content.length <= 300) {
        this.setState({ error: true })
        message.warning(this.t('POST_REQUIRED_CONTENT'));
        document.querySelector('#content').scrollIntoViewIfNeeded();
      } else {
        message.warning(this.t('POST_INPUT_REQUIRED'));
        document.querySelector(`#${Object.keys(error)[0]}`).focus();
        document.querySelector(`#${Object.keys(error)[0]}`).scrollIntoViewIfNeeded();
      }
    })
  }

  onBack = () => {
    window.history.back();
  }

  submit = (item, pub = false, noModal) => {
    item.status = pub ? STATUS_PUBLIC : STATUS_PRIVATE;
    const showSuccess = () => {
      if (pub) {
        message.success(this.t('POST_DONE'));
      }
    }
    const showError = () => {
      message.success(this.t('ERROR'));
    }
    if (this.props.addMode)
      createBlog(item)
        .then((data) => {
          this.redirect(data, noModal);
          showSuccess();
        })
        .catch(showError);
    else
      modifyBlog({ ...this.post, ...item })
        .then((data) => {
          this.redirect(data, noModal);
          showSuccess(showError);
        })
  }

  redirect = ({ id, status }, noModal) => {
    if (noModal === true) {
      this.setState({ unblock: true },
        () => { window.location = `#/blog-management` })
    } else {
      Modal.confirm({
        title: this.t(status ? 'POST_SUBMIT_DONE' : 'POST_SAVE_DRAFT'),
        okText: this.t('VIEW_POST'),
        cancelText: this.t('ACT_BACK'),
        onOk: () => {
          this.setState({ unblock: true },
            () => { window.open(`/blog/post?postId=${id}`) })
        },
        onCancel: () => {
          this.setState({ unblock: true },
            () => { window.location = `#/blog-management` })
        }
      })
    }
  }

  componentDidMount() {
    if (!this.props.addMode) {
      getBlog(this.props.id)
        .then((data) => {
          this.props.form.setFieldsValue({
            title: data.title,
            categoryId: data.categoryId,
            provinceId: data.provinceId,
            introduction: data.introduction,
            bannerContentName: data.bannerContentName ? [{
              uid: -1,
              url: RESOURCES_PATH + data.bannerContentName,
              response: { name: data.bannerContentName }
            }] : []
          })
          this.setState({
            content: data.content,
            tagList: data.tagList
          })
          this.post = data;
        })
    }
  }

  back = () => {
    this.setState({ unblock: true }, this.onBack)
  }

  routeSave = () => {
    this.onSaveDraft(true);
  }

  checkFileUpload = (e) => {
    if (e && e.file.size > MAX_UPLOAD_SIZE) {
      message.warn(this.t('IMAGE_TOO_LARGE'));
      return false;
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render = () => {
    const { places, categories, form, addMode } = this.props;
    const { tagList, content, unblock } = this.state;
    const { getFieldDecorator } = form;
    const placeholder = this.props.t('INPUT_INFORMATION')
    const showUpload = !form.getFieldValue('bannerContentName')
      || (form.getFieldValue('bannerContentName') && !form.getFieldValue('bannerContentName').length);
    return (
      <Form>
        <Prompt
          when={!unblock}
          onOk={this.routeSave}
          onCancel={this.back}
          title={this.t(addMode ? 'SAVE_DRAFT_CONFIRM' : 'SAVE_DRAFT_UPDATE')}
        />
        <div className="editable container-fluid">
          <div className="row">
            <div className="col-9">
              <div className="editable__title">{this.props.t('POST_INFO')}</div>
              <FormItem
                {...formItemLayout}
                label={this.props.t('TITLE')}>
                {getFieldDecorator('title',
                  { rules: [{ required: true, message: this.t('POST_REQUIRE_TITLE') }] })(
                    <Input placeholder={this.t('POST_TITLE_HINT')} maxLength={150} id="title" />)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={this.props.t('CATEGORY')}>
                {getFieldDecorator('categoryId')(
                  <Select
                    placeholder={placeholder}
                    style={{ width: 200 }}>
                    {categories.map((cate) =>
                      (<Option key={cate.id} value={cate.id}>{cate.title}</Option>))}
                  </Select>)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={this.props.t('PLACE_NAME')}>
                {getFieldDecorator('provinceId')(
                  <Select
                    placeholder={placeholder}
                    style={{ width: 200 }}>
                    {places.map((place) =>
                      (<Option key={place.id} value={place.id}>{place.name}</Option>))}
                  </Select>)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={this.props.t('TAGS')}>
                <Tags tags={tagList.filter((tag) => (tag && true))} onChange={this.onTagChange} />
              </FormItem>
            </div>
            <div className="col-3 editable__upload">
              <div className="editable__title">{this.props.t('POST_BANNER')}</div>
              <FormItem label={this.props.t('BANNER')}>
                {getFieldDecorator('bannerContentName', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.checkFileUpload,
                  rules: [{ required: true, message: this.props.t('POST_REQUIRE_BANNER') }]
                })(
                  <Upload
                    id="bannerContentName"
                    accept="image/*"
                    isWatermark
                    listType="picture-card">
                    {showUpload && <span>
                      <Icon type="plus" />
                      {this.props.t('ACT_UPLOAD')}
                    </span>}
                  </Upload>)}
              </FormItem>
            </div>
          </div>
          <Divider />
          <div className="editable__editor">
            <div className="editable__title">{this.props.t('POST_CONTENT')}</div>
            <FormItem
              label={this.props.t('INTRODUCTION')}>
              {getFieldDecorator('introduction',
                {
                  rules: [
                    { required: true, message: this.t('POST_REQUIRE_DESCRIPTION') },
                    { min: 30, message: this.t('POST_REQUIRE_DESCRIPTION_MIN') }]
                })(
                  <Input.TextArea
                    rows={3}
                    id="introduction"
                    placeholder={this.props.t('EDITOR_PLACEHOLDER')}
                  />)}
            </FormItem>
            <FormItem
              label={this.props.t('CONTENT')}>
              {this.state.error && <div id="content" className="error">{this.props.t('POST_REQUIRED_CONTENT_MIN')}</div>}
              <div className="editable__editor">
                <Editor
                  allowUpload
                  value={content}
                  onChange={this.onContentChange}
                />
              </div>
            </FormItem>
          </div>
          <div className="editable__footer">
            <Button type="default" className="mgL8" onClick={this.onBack}>{this.props.t('ACT_BACK')}</Button>
            <Button type="dashed" className="mgL8" onClick={this.onSaveDraft}>{this.props.t('ACT_SAVE_DRAFT')}</Button>
            <Button type="primary" onClick={this.onSubmit}>{this.props.t('ACT_POST')}</Button>
          </div>
        </div>
      </Form >);
  }
}

export default injectIntl(connect((state) => ({ user: state.common.user.user_name }))(Form.create()(Blog)));