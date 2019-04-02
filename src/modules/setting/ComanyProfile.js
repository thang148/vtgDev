import React from 'react';
import Upload from 'components/Upload';
import Location from 'components/Location';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Form, Input, Icon, message } from 'antd';
import { setCompanyInfo, getCompanyInfo } from './settingServices';
import { RESOURCES_PATH } from '../common/constants';
import './Settings.less';

const FormItem = Form.Item;

class CompanyProfile extends React.PureComponent {
  state = {};
  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          headerLogo: values.headerLogo[0].response.name,
          footerLogo: values.footerLogo[0].response.name
        }
        setCompanyInfo(data)
          .then(() => { message.success('Updated!') })
          .catch(() => { message.error('Update failed!') })
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

  componentDidMount() {
    getCompanyInfo()
      .then((data) => {
        this.props.form.setFieldsValue({
          ...data,
          headerLogo: [{ uid: -1, url: RESOURCES_PATH + data.headerLogo, response: { name: data.headerLogo } }],
          footerLogo: [{ uid: -1, url: RESOURCES_PATH + data.footerLogo, response: { name: data.footerLogo } }]
        });
      });
  }

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const placeholder = this.props.intl.formatMessage({ id: 'INPUT_INFORMATION' });
    const { headerLogo, footerLogo } = getFieldsValue(['headerLogo', 'footerLogo']);
    const showUploadHeader = !headerLogo || (headerLogo && !headerLogo.length),
      showUploadFooter = !footerLogo || (footerLogo && !footerLogo.length);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <Form>

              {/* --------------------------------------------------------------------------------------------------------------------------------------- */}
              <span className="text-strike"><FormattedMessage id="GENARAL_INFOMATION" /></span>

              <FormItem {...layout} label={<FormattedMessage id="FULL_COMPANY_NAME" />} >
                {getFieldDecorator('companyName', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="OFFICIAL_WEBSITE" />} >
                {getFieldDecorator('website', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="CERT" />} >
                {getFieldDecorator('cert', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="EMAIL" />} >
                {getFieldDecorator('email', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="COMPANY_PHONE" />} >
                {getFieldDecorator('phone', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="COMPANY_HOTLINE" />} >
                {getFieldDecorator('hotline', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="COMPANY_FAX" />} >
                {getFieldDecorator('fax', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="SKYPE" />} >
                {getFieldDecorator('skype', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="OPENING_HOURS" />} >
                {getFieldDecorator('openHours', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>

              {/* --------------------------------------------------------------------------------------------------------------------------------------- */}
              <span className="text-strike"><FormattedMessage id="LOGO" /></span>

              <FormItem {...layout} label={<FormattedMessage id="HEADER_LOGO" />} help="Kích thước ảnh nên dùng 120x46">
                {getFieldDecorator('headerLogo',
                  {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.checkFileUpload,
                    rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }]
                  })(
                    <Upload listType="picture-card" >
                      {showUploadHeader && <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text"><FormattedMessage id="ACT_UPLOAD" /></div>
                      </div>}
                    </Upload>
                  )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="FOOTER_LOGO" />} help="Kích thước ảnh nên dùng 150x150">
                {getFieldDecorator('footerLogo',
                  {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.checkFileUpload,
                    rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }]
                  })(
                    <Upload listType="picture-card">
                      {showUploadFooter && <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text"><FormattedMessage id="ACT_UPLOAD" /></div>
                      </div>}
                    </Upload>
                  )}
              </FormItem>

              {/* --------------------------------------------------------------------------------------------------------------------------------------- */}
              <span className="text-strike"><FormattedMessage id="BUSSINESS_ADDRESS" /></span>

              <FormItem {...layout} label={<FormattedMessage id="ADDRESS_LINE_1" />} >
                {getFieldDecorator('addressLineF', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input.TextArea rows={3} placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="ADDRESS_LINE_2" />} >
                {getFieldDecorator('addressLineS', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input.TextArea rows={3} placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="COPYRIGHT" />} >
                {getFieldDecorator('copyright', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>

              {/* --------------------------------------------------------------------------------------------------------------------------------------- */}
              <span className="text-strike"><FormattedMessage id="SOCIAL_MEDIA" /></span>

              <FormItem {...layout} label={<FormattedMessage id="FACEBOOK_LINK" />} >
                {getFieldDecorator('fbLink', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="INSTAGRAM_LINK" />} >
                {getFieldDecorator('insLink', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="TWITTER_LINK" />} >
                {getFieldDecorator('twLink', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="YOUTUBE_LINK" />} >
                {getFieldDecorator('ytbLink', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...layout} label={<FormattedMessage id="GOOGLE_LINK" />} >
                {getFieldDecorator('gpLink', { rules: [{ required: true, message: <FormattedMessage id="REQUIRED_INPUT" /> }] })(
                  <Input placeholder={placeholder} />
                )}
              </FormItem>
              <FormItem {...tailLayout}>
                <Button type="primary" onClick={this.onSubmit}><FormattedMessage id="ACT_SAVE" /></Button>
              </FormItem>
            </Form>
          </div>
          <div className="col-md-6">
            <span className="text-strike"><FormattedMessage id="LOCATION" /></span>
            <Location />
          </div>
        </div>
      </div>
    )
  }
}

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default injectIntl(Form.create()(CompanyProfile));