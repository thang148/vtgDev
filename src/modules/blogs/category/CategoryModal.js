import React from 'react';
import { Input, Button, Modal, Form, message } from 'antd';
import Prompt from 'components/Prompt';
import { createCategory, modifyCategory } from '../BlogServices';
import { FormattedMessage } from 'react-intl';

class Category extends React.Component {
  state = { loading: false }

  onClose = () => {
    if (!this.state.loading)
      this.props.toggle()
  }

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const onSuccess = () => {
          this.setState({ loading: false }, this.onClose)
        }
        const onFail = () => {
          message.error(this.props.t(this.props.addMode ? 'ADD_CATEGORY_EXITS' : 'MODIFY_CATEGORY_EXITS'));
          this.setState({ loading: false })
        }
        if (this.props.addMode)
          createCategory(values)
            .then(onSuccess)
            .catch(onFail)
        else
          modifyCategory({ ...this.props.data, ...values })
            .then(onSuccess)
            .catch(onFail)
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      const { data } = this.props;
      if (this.props.addMode)
        this.props.form.resetFields(['title', 'introduction'])
      else
        this.props.form.setFieldsValue({
          title: data.title,
          introduction: data.introduction
        })
    }
  }
  render() {
    const { show, addMode, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        centered
        visible={show}
        title={<FormattedMessage id={addMode ? "ADD_CATEGORY" : "MODIFY_CATEGORY"} />}
        onCancel={this.onClose}
        footer={[
          <Button key="back" onClick={this.onClose}>
            <FormattedMessage id="ACT_CANCEL" />
          </Button>,
          <Button key="submit" type="primary" onClick={this.onSubmit}>
            <FormattedMessage id={addMode ? "ACT_ADD" : "ACT_SAVE"} />
          </Button>
        ]}>
        <Prompt when={show} hide callback={this.props.toggle} />
        <Form>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="CATEGORY_NAME" />} >
            {getFieldDecorator('title',
              { rules: [{ required: true, message: this.props.t('CATEGORY_REQUIRE_NAME') }] })(
                <Input maxLength={150} placeholder={this.props.t('CATEGORY_HINT_NAME')} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="DESCRIPTION" />}>
            {getFieldDecorator('introduction',
              { rules: [{ required: true, message: this.props.t('CATEGORY_REQUIRE_DES') }] })(
                <Input.TextArea rows={3} maxLength={300} placeholder={this.props.t('CATEGORY_HINT_DES')} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

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


export default Form.create()(Category)