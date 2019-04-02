import React from 'react';
import injectIntl from 'intl';
import RichEditor from 'components/RichEditor';
import { FormattedMessage } from 'react-intl';
import { Form, Button, message } from 'antd';
import { setCopyrightInfo, getCopyrightInfo } from '../BlogServices';
const FormItem = Form.Item;

class CompanyProfile extends React.PureComponent {
  state = { editable: false, loading: false };

  onModify = () => {
    this.setState({ editable: true })
  }

  onChange = (content) => {
    this.setState({ content })
  }

  onSubmit = () => {
    this.setState({ loading: true })
    const { content } = this.state;
    setCopyrightInfo(content)
      .then(() => {
        message.success(this.props.t('DONE'));
        this.setState({ loading: false, editable: false });
      })
      .catch(() => {
        message.error(this.props.t('ERROR'));
        this.setState({ loading: false });
      })
  }

  componentDidMount() {
    getCopyrightInfo()
      .then(({ value }) => {
        this.setState({ content: value })
      })
  }

  render() {
    return (
      <div className="container-fluid">
        <FormItem label={<FormattedMessage id="BLOG_COPYRIGHT" />} >
          {this.state.editable ?
            <RichEditor
              value={this.state.content}
              onChange={this.onChange} />
            : <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
          }
        </FormItem>
        <div style={{ float: "right" }}>
          <Button
            type="dashed"
            disabled={this.state.editable}
            onClick={this.onModify}
            style={{ marginRight: 8 }}>
            <FormattedMessage id="ACT_MODIFY" />
          </Button>
          <Button
            type="primary"
            onClick={this.onSubmit}
            loading={this.state.loading}
            disabled={!this.state.editable}>
            <FormattedMessage id="ACT_SAVE" />
          </Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(Form.create()(CompanyProfile));