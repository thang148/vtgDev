import React from 'react';
import Prompt from 'components/Prompt';
import { FormattedMessage } from 'react-intl';
import { createCountry, updateCountry } from './services';
import { Modal, Button, Form, Input, message } from 'antd';

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

class CountryModal extends React.PureComponent {
  state = { loading: false }

  onClose = () => {
    if (!this.state.loading)
      this.props.toggle()
  }

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const onSuccess = () => {
          message.success(this.props.t(this.props.addMode
            ? 'COUNTRY_ADD_DONE'
            : 'COUNTRY_UPDATE_DONE'));
          this.setState({ loading: false }, this.onClose)
        }
        const onFail = () => {
          message.error(this.props.t(this.props.addMode
            ? 'COUNTRY_ADD_EXITS'
            : 'COUNTRY_MODIFY_EXITS'));
          this.setState({ loading: false })
        }
        if (this.props.addMode)
          createCountry(values)
            .then(onSuccess)
            .catch(onFail)
        else
          updateCountry({ ...this.props.data, ...values })
            .then(onSuccess)
            .catch(onFail)
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      const { data } = this.props;
      if (this.props.addMode)
        this.props.form.resetFields(['name', 'slogan', 'latitude', 'longitude', 'description'])
      else
        this.props.form.setFieldsValue({
          name: data.name,
          slogan: data.slogan,
          latitude: data.latitude,
          longitude: data.longitude,
          description: data.description
        })
    }
  }

  render = () => {
    const { show, form, addMode } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        centered
        visible={show}
        closable={false}
        // onCancel={this.onClose}
        title={<FormattedMessage id={addMode ? "ADD_COUNTRY" : "MODIFY_COUNTRY"} />}
        footer={[
          <Button key="back" onClick={this.onClose}>
            <FormattedMessage id="ACT_CANCEL" />
          </Button>,
          <Button key="submit" type="primary" onClick={this.onSubmit}>
            <FormattedMessage id={addMode ? "ACT_ADD" : "ACT_SAVE"} />
          </Button>,
        ]}>
        <Form>
          <Prompt when={show} hide callback={this.props.toggle} />
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="COUNTRY_NAME" />}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: this.props.t('COUNTRY_REQUIRED_NAME') }]
            })(
              <Input maxLength={50} placeholder={this.props.t('COUNTRY_HINT_NAME')} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="SLOGAN" />} >
            {getFieldDecorator('slogan',
              { rules: [{ required: true, message: this.props.t('COUNTRY_REQUIRED_SLOGAN') }] })(
                <Input maxLength={100} placeholder={this.props.t('COUNTRY_HINT_SLOGAN')} />)}
          </FormItem>
          <FormItem
            style={{ display: 'none' }}
            {...formItemLayout}
            label={<FormattedMessage id="LOCATION" />}>
            {getFieldDecorator('latitude')(
              <Input />)}
          </FormItem>
          <FormItem
            style={{ display: 'none' }}
            {...formItemLayout}
            label={<FormattedMessage id="LOCATION" />}>
            {getFieldDecorator('longitude')(
              <Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="DESCRIPTION" />}>
            {getFieldDecorator('description')(
              <Input.TextArea rows={3} maxLength={100} placeholder={this.props.t('COUNTRY_HINT_DES')} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CountryModal)

