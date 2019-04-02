import React from 'react';
import injectIntl from 'intl';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button, message } from 'antd';
import { putSetting, getSetting } from './settingServices';
import Editor from 'components/RichEditor';
import './Settings.less';

class CompanyProfile extends React.PureComponent {
  state = { loading: false, content: '' };
  onSubmit = () => {
    this.setState({ loading: true })
    const data = { name: this.props.mode, value: this.state.content, }
    putSetting(data)
      .then(() => {
        message.success(this.props.t('DONE'));
        this.setState({ loading: false });
      })
      .catch(() => {
        message.error(this.props.t('ERROR'));
        this.setState({ loading: false });
      })
  }

  onContentChange = (content) => {
    this.setState({ content })
  }

  componentDidMount() {
    getSetting(this.props.mode)
      .then(({ value }) => {
        this.setState({ content: value })
      })
  }

  render() {
    const { content } = this.state;
    return (
      <div className="container-fluid">
        <span className="text-strike"><FormattedMessage id={this.props.mode} /></span>
        <div style={{ padding: '16px 0' }}>
          <Editor
            value={content}
            onChange={this.onContentChange} />
        </div>
        <div style={{ float: "right" }}>
          <Button
            type="primary"
            onClick={this.onSubmit}
            loading={this.state.loading}>
            <FormattedMessage id="ACT_SAVE" />
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(injectIntl(CompanyProfile));