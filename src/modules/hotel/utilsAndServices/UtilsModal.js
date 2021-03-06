import React from 'react';
import Upload from 'components/Upload';
import { Modal, Form, message, Icon, Input } from 'antd';
import { UpdateUtils, UpdateService } from "./sevices";


class UtilsModal extends React.Component {
  state = { loading: false }

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

  componentDidUpdate(preProps) {
    if (!preProps.visible && this.props.visible) {
      const { setFieldsValue, resetFields } = this.props.form;
      resetFields(['icon'])
      setFieldsValue({ description: this.props.data.description })
    }
  }

  onSubmit = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const data = {
          ...this.props.data,
          ...values,
          icon: values.icon[0].response.name,
        }
        if (this.props.isUtils) {
          UpdateUtils(data).then(() => {
            this.props.fetch();
          }).catch(() => { });
          this.props.toggle();
        } else {
          UpdateService(data).then(() => {
            this.props.fetch();
          }).catch(() => { });
          this.props.toggle();
        }
      }
    })
  }

  render() {
    const { t, isUtils, addMode } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const showUploadIcon = !getFieldValue('icon');
    let title, nameTitle, placeholder, required;
    if (isUtils) {
      nameTitle = t('UTIL_NAME');
      placeholder = t('UTIL_NAME_PLH');
      required = t('UTIL_NAME_REQUIRED');
      if (addMode) {
        title = t('ADD_UTILS')
      } else {
        title = t('EDIT_UTILS')
      }
    } else {
      nameTitle = t('SERVICE_NAME');
      placeholder = t('SERVICE_NAME_PLH');
      required = t('SERVICE_NAME_REQUIRED');
      if (addMode) {
        title = t('ADD_SERVICES')
      } else {
        title = t('EDIT_SERVICES')
      }
    }

    return (
      <Form>
        <Modal
          title={title}
          onOk={this.onSubmit}
          onCancel={this.props.toggle}
          visible={this.props.visible}
          confirmLoading={this.state.loading}>
          <Form.Item label={nameTitle}>
            {getFieldDecorator('description',
              { rules: [{ required: true, message: required }] })(
                <Input placeholder={placeholder} maxLength={50} />)}
          </Form.Item>
          <Form.Item
            label={t('ICON')}>
            {getFieldDecorator('icon', {
              valuePropName: 'fileList',
              getValueFromEvent: this.checkFileUpload,
              rules: [{ required: true, message: this.props.t('ICON_REQUIRED') }]
            })(
              <Upload listType="picture-card" isWatermark={true}>
                {showUploadIcon && <span>
                  <Icon type="plus" />
                  {this.props.t('ACT_UPLOAD')}
                </span>}
              </Upload>
            )}
          </Form.Item>
        </Modal>
      </Form>)
  }
}

export default Form.create()(UtilsModal)
