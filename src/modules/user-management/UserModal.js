import React from 'react';
import { Input, Modal, Form, Select, message, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as Services from './services';
import Prompt from 'components/Prompt';

const FormItem = Form.Item;
const Option = Select.Option;

const ListRole = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Content Maneger', value: 'CONTENT_MANAGER' },
    { label: 'Provider', value: 'PROVIDER' },
    { label: 'Soccial User', value: 'SOCIAL_USER' },
    { label: 'User', value: 'USER' }
]
class UserModal extends React.Component {

    onDelete = (item, e) => {
        e.preventDefault();
        Services.DeleteUser(item.id).then(() => {
            message.success(this.t("SUCCESSFULLY"));
            this.props.updateTable();
        }).catch(() => {
            message.error(this.t("ERROR"));
        })
    }

    onClose = (e) => {
        this.props.toggle();
    }

    onSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const onSuccess = () => {
                    this.props.updateTable();
                    message.success(this.props.t("SUCCESSFULLY"));
                    this.onClose();
                }
                const onFail = () => {
                    message.error(this.props.t("ERROR"));
                }
                if (this.props.addMode)
                    Services.CreateUser(values)
                        .then(onSuccess)
                        .catch(onFail)
                else
                    Services.UpdateUser({ ...this.props.data, ...values })
                        .then(onSuccess)
                        .catch(onFail)
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.showModal && this.props.showModal) {
            const { data } = this.props;
            if (this.props.addMode)
                this.props.form.resetFields(['username', 'password', 'email', 'phoneNumber', 'role'])
            else
                this.props.form.setFieldsValue({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    role: data.role
                })
        }
    }

    render() {
        const { form, showModal, addMode } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={<FormattedMessage id={addMode ? 'CREATE_USER' : 'EDIT_USER'} />}
                visible={showModal}
                closable={false}
                footer={[
                    <Button key="back" onClick={this.onClose}>
                        <FormattedMessage id="ACT_CANCEL" />
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.onSubmit}>
                        <FormattedMessage id={addMode ? "ACT_ADD" : "ACT_SAVE"} />
                    </Button>,
                ]}>
                <Form>
                    <Prompt when={showModal} hide callback={this.props.toggle} />
                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="USERNAME" />}>
                        {getFieldDecorator('username',
                            { rules: [{ required: true, message: this.props.t('REQUIRED_USERNAME') }] })(
                                <Input maxLength={12} placeholder={this.props.t('INPUT_USERNAME')} />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="PASSWORD" />}>
                        {getFieldDecorator('password',
                            { rules: [{ required: true, message: this.props.t('REQUIRED_PASSWORD') }] })(
                                <Input maxLength={12} placeholder={this.props.t('INPUT_PASSWORD')} />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="EMAIL" />} >
                        {getFieldDecorator('email',
                            { rules: [{ required: true, message: this.props.t('REQUIRED_EMAIL') }] })(
                                <Input maxLength={30} placeholder={this.props.t('INPUT_EMAIL')} />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="PHONE_NUM" />}>
                        {getFieldDecorator('phoneNumber',
                            { rules: [{ required: true, message: this.props.t('REQUIRED_PHONE') }] })(
                                <Input maxLength={15} placeholder={this.props.t('INPUT_PHONE')} />)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="ROLE" />}>
                        {getFieldDecorator('role',
                            { rules: [{ required: true, message: this.props.t('REQUIRED_STATUS') }] })(
                                <Select style={{ width: 200 }} placeholder={this.props.t("INPUT_ROLE")}                                 >
                                    {ListRole.map((item, key) => {
                                        return (
                                            <Option key={key} value={item.value}>{item.label}</Option>
                                        )
                                    })}
                                </Select>
                            )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="STATUS" />}>
                        {getFieldDecorator('status',
                            { rules: [{ required: true, message: this.props.t('REQUIRED_STATUS') }] })(
                                <Input maxLength={15} placeholder={this.props.t('INPUT_STATUS')}
                                />)}
                    </FormItem>
                </Form>
            </Modal>

        );
    }
}

export default Form.create()(UserModal);

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
    },
};