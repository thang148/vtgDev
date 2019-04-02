import React from 'react';
import Prompt from 'components/Prompt';
import { Upload } from 'components';
import { FormattedMessage } from 'react-intl';
import { createPlace, updatePlace } from './services'
import { RESOURCES_PATH } from '../common/constants';
import { Modal, Button, Form, Input, Icon, message } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class PlaceModal extends React.Component {
  state = { loading: false }

  onClose = () => {
    if (!this.state.loading)
      this.props.toggle()
  }

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...this.props.data,
          ...values,
          adsList: [
            { adsUrl: values.url1, name: values.ads1[0].response.name },
            { adsUrl: values.url2, name: values.ads2[0].response.name }],
          contentNames: values.contentNames.map(({ response }) => (response.name))
        }
        delete data.ads1
        delete data.ads2
        delete data.url1
        delete data.url2
        const onSuccess = () => {
          message.success(this.props.t(this.props.addMode
            ? 'PLACE_ADD_DONE'
            : 'PLACE_UPDATE_DONE'));
          this.setState({ loading: false }, this.onClose)
        }
        const onFail = () => {
          message.error(this.props.t(this.props.addMode
            ? 'PLACE_ADD_EXITS'
            : 'PLACE_MODIFY_EXITS'));
          this.setState({ loading: false })
        }
        if (this.props.addMode)
          createPlace(data)
            .then(onSuccess)
            .catch(onFail)
        else
          updatePlace(data)
            .then(onSuccess)
            .catch(onFail)
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      const { data } = this.props;
      if (this.props.addMode)
        this.props.form.resetFields(
          ['name',
            'slogan',
            'latitude',
            'longitude',
            'introduction',
            'contentNames',
            'countryId',
            'url1',
            'url2',
            'ads1',
            'ads2'])
      else
        this.props.form.setFieldsValue({
          name: data.name,
          slogan: data.slogan,
          latitude: data.latitude,
          longitude: data.longitude,
          countryId: data.countryId,
          introduction: data.introduction,
          url1: data.adsList[0] ? data.adsList[0].adsUrl : undefined,
          url2: data.adsList[1] ? data.adsList[1].adsUrl : undefined,
          ads1: data.adsList[0] ? [{ uid: data.adsList[0].name, url: RESOURCES_PATH + data.adsList[0].name, response: { name: data.adsList[0].name } }] : [],
          ads2: data.adsList[1] ? [{ uid: data.adsList[1].name, url: RESOURCES_PATH + data.adsList[1].name, response: { name: data.adsList[1].name } }] : [],
          contentNames: data.contentNames ? data.contentNames.filter((i) => (!!i)).map((id) => ({ uid: id, url: RESOURCES_PATH + id, response: { name: id } })) : []
        })
    }
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

  render = () => {
    const { show, form, addMode } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { ads1, ads2, contentNames } = getFieldsValue(['contentNames', 'ads1', 'ads2']);
    const showUAds1 = !ads1 || (ads1 && !ads1.length),
      showUAds2 = !ads2 || (ads2 && !ads2.length),
      showUBanner = !contentNames || (contentNames && contentNames.length <= 15);
    return (
      <Modal
        centered
        visible={show}
        onCancel={this.onClose}
        title={<FormattedMessage id={addMode ? "ADD_PLACE" : "MODIFY_PLACE"} />}
        footer={[
          <Button key="back" onClick={this.onClose}>
            <FormattedMessage id="ACT_CANCEL" />
          </Button>,
          <Button key="submit" type="primary" onClick={this.onSubmit}>
            <FormattedMessage id={addMode ? "ACT_ADD" : "ACT_SAVE"} />
          </Button>
        ]}>
        <Form>
          <Prompt when={show} hide callback={this.props.toggle} />
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="PLACE_NAME" />}>
            {getFieldDecorator('name',
              { rules: [{ required: true, message: this.props.t('PLACE_REQUIRED_NAME') }] })(
                <Input maxLength={50} placeholder={this.props.t('PLACE_HINT_NAME')} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="SLOGAN" />}>
            {getFieldDecorator('slogan',
              { rules: [{ required: true, message: this.props.t('PLACE_REQUIRED_SLOGAN') }] })(
                <Input maxLength={100} placeholder={this.props.t('PLACE_HINT_SLOGAN')} />)}
          </FormItem>
          <FormItem
            style={{ display: 'none' }}
            {...formItemLayout}
            label={<FormattedMessage id="LOCATION" />}>
            {getFieldDecorator('latitude')(<Input />)}
          </FormItem>
          <FormItem
            style={{ display: 'none' }}
            {...formItemLayout}
            label={<FormattedMessage id="LOCATION" />}>
            {getFieldDecorator('longitude')(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="IMG_BANNER" />}>
            {getFieldDecorator('contentNames', {
              valuePropName: 'fileList',
              getValueFromEvent: this.checkFileUpload,
              rules: [{ required: true, message: this.props.t('PLACE_REQUIRED_BANNER') }]
            })(
              <Upload listType="picture-card" multiple>
                {showUBanner && <span>
                  <Icon type="plus" />
                  {this.props.t('ACT_UPLOAD')}
                </span>}
              </Upload>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            help={<FormattedMessage id="SUGGEST_SIZE_ADS" />}
            label={<FormattedMessage id="IMG_ADS_1" />}>
            {getFieldDecorator('ads1', {
              valuePropName: 'fileList',
              getValueFromEvent: this.checkFileUpload,
              rules: [{ required: true, message: this.props.t('PLACE_REQUIRED_ADS_F') }]
            })(
              <Upload listType="picture">
                {showUAds1 && <Button>
                  <Icon type="upload" /><FormattedMessage id="ACT_UPLOAD" />
                </Button>}
              </Upload>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="LINK_ADS_1" />}>
            {getFieldDecorator('url1',
              {
                rules: [
                  { required: true, message: this.props.t('PLACE_REQUIRED_ADS_LINK_F') },
                  { type: 'url', message: <FormattedMessage id="URL_INVALID" /> }]
              })(
                <Input placeholder={this.props.t('PLACE_HINT_ADS_LINK_F')} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            help={<FormattedMessage id="SUGGEST_SIZE_ADS" />}
            label={<FormattedMessage id="IMG_ADS_2" />}>
            {getFieldDecorator('ads2', {
              valuePropName: 'fileList',
              getValueFromEvent: this.checkFileUpload,
              rules: [{ required: true, message: this.props.t('PLACE_REQUIRED_ADS_S') }]
            })(
              <Upload listType="picture">
                {showUAds2 && <Button>
                  <Icon type="upload" /><FormattedMessage id="ACT_UPLOAD" />
                </Button>}
              </Upload>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="LINK_ADS_2" />}>
            {getFieldDecorator('url2',
              {
                rules: [
                  { required: true, message: this.props.t('PLACE_REQUIRED_ADS_LINK_S') },
                  { type: 'url', message: <FormattedMessage id="URL_INVALID" /> }]
              })(
                <Input placeholder={this.props.t('PLACE_HINT_ADS_LINK_S')} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="DESCRIPTION" />}>
            {getFieldDecorator('introduction')(<Input.TextArea rows={3} placeholder={this.props.t('PLACE_HINT_DES')} maxLength={300} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(PlaceModal);

