import React from 'react';
import Upload from 'components/Upload';
import injectIntl, { FormattedMessage } from 'intl';
import { Button, Form, Input, Icon, Modal, message } from 'antd';
import { RESOURCES_PATH } from '../common/constants';
import { updatePage } from './settingServices';

const FormItem = Form.Item;

class FormInput extends React.PureComponent {
  state = { loading: false }

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...this.props.data,
          ...values,
          ads1: values.ads1[0].response.name,
          ads2: values.ads2[0].response.name,
          contentNames: values.contentNames.map(({ response }) => (response.name))
        }
        this.setState({ loading: true })
        updatePage(data)
          .then(() => {
            message.success(this.props.t('SUCCESSFULLY'));
            this.setState({ loading: false })
            this.props.onHide();
          })
          .catch(() => {
            message.error(this.props.t('ERROR'));
            this.setState({ loading: false })
          });
      }
    });
  }

  checkFileUpload = (e) => {
    const MAX_UPLOAD_SIZE = 3 * 1024 * 1024;
    if (e && e.file.size > MAX_UPLOAD_SIZE) {
      message.warn(this.props.t('IMAGE_TOO_LARGE'));
      return false;
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      const { data } = this.props;
      if (this.props.addMode)
        this.props.form.resetFields(['name', 'description', 'contentNames', 'url1', 'url2', 'ads1', 'ads2'])
      else
        this.props.form.setFieldsValue({
          name: data.name,
          description: data.description,
          url1: data.url1,
          url2: data.url2,
          ads1: data.ads1 ? [{ uid: data.ads1, url: RESOURCES_PATH + data.ads1, response: { name: data.ads1 } }] : [],
          ads2: data.ads2 ? [{ uid: data.ads2, url: RESOURCES_PATH + data.ads2, response: { name: data.ads2 } }] : [],
          contentNames: data.contentNames ? data.contentNames.filter((i) => (!!i)).map((id) => ({ uid: id, url: RESOURCES_PATH + id, response: { name: id } })) : []
        })
    }
  }

  render = () => {
    const { visible, addMode, onHide } = this.props;
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const { ads1, ads2, contentNames } = getFieldsValue(['contentNames', 'ads1', 'ads2']);
    const showUAds1 = !ads1 || (ads1 && !ads1.length),
      showUAds2 = !ads2 || (ads2 && !ads2.length),
      showUBanner = !contentNames || (contentNames && contentNames.length <= 15);
    return (
      <Form>
        <Modal
          visible={visible}
          confirmLoading={this.state.loading}
          title={<FormattedMessage id={addMode ? "ADD_PAGE" : "MODIFY_PAGE"} />}
          onCancel={onHide}
          footer={[
            <Button key="back" onClick={onHide}>
              <FormattedMessage id="ACT_CANCEL" />
            </Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>
              <FormattedMessage id={addMode ? "ACT_ADD" : "ACT_SAVE"} />
            </Button>,
          ]}>
          <FormItem label={<FormattedMessage id="PAGE_NAME" />} >
            {getFieldDecorator('name', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
              <Input />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage id="DESCRIPTION" />}>
            {getFieldDecorator('description', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
              <Input.TextArea rows={3} />
            )}
          </FormItem>
          <FormItem label={<FormattedMessage id="ASSETS" />}>
            {getFieldDecorator('contentNames',
              {
                valuePropName: 'fileList',
                getValueFromEvent: this.checkFileUpload,
                rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }]
              })(
                <Upload listType="picture-card" multiple>
                  {showUBanner && <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text"><FormattedMessage id="ACT_UPLOAD" /></div>
                  </div>}
                </Upload>
              )}
          </FormItem>
          <FormItem
            help={<FormattedMessage id="SUGGEST_SIZE_ADS" />}
            label={<FormattedMessage id="IMG_ADS_1" />}>
            {getFieldDecorator('ads1', {
              valuePropName: 'fileList',
              getValueFromEvent: this.checkFileUpload,
              rules: [{ required: true, message: <FormattedMessage id="PLACE_REQUIRED_ADS_F" /> }]
            })(
              <Upload listType="picture">
                {showUAds1 && <Button>
                  <Icon type="upload" /><FormattedMessage id="ACT_UPLOAD" />
                </Button>}
              </Upload>
            )}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="LINK_ADS_1" />}>
            {getFieldDecorator('url1',
              {
                rules: [
                  { required: true, message: <FormattedMessage id="PLACE_REQUIRED_ADS_LINK_F" /> },
                  { type: 'url', message: <FormattedMessage id="URL_INVALID" /> }]
              })(
                <Input placeholder={this.props.t("PLACE_HINT_ADS_LINK_F")} />)}
          </FormItem>
          <FormItem
            help={<FormattedMessage id="SUGGEST_SIZE_ADS" />}
            label={<FormattedMessage id="IMG_ADS_2" />}>
            {getFieldDecorator('ads2', {
              valuePropName: 'fileList',
              getValueFromEvent: this.checkFileUpload,
              rules: [{ required: true, message: <FormattedMessage id="PLACE_REQUIRED_ADS_S" /> }]
            })(
              <Upload listType="picture">
                {showUAds2 && <Button>
                  <Icon type="upload" /><FormattedMessage id="ACT_UPLOAD" />
                </Button>}
              </Upload>
            )}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="LINK_ADS_2" />}>
            {getFieldDecorator('url2',
              {
                rules: [
                  { required: true, message: <FormattedMessage id="PLACE_REQUIRED_ADS_LINK_S" /> },
                  { type: 'url', message: <FormattedMessage id="URL_INVALID" /> }]
              })(
                <Input placeholder={this.props.t("PLACE_HINT_ADS_LINK_S")} />)}
          </FormItem>
        </Modal>
      </Form>
    )
  }
}
export default injectIntl(Form.create()(FormInput));