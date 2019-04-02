import React from 'react';
import Editor from 'components/RichEditor'
import injectIntl, { FormattedMessage } from 'intl';
import { Input, Button, Divider } from 'antd';
import './Upload.less';

export default injectIntl(class UploadGuide extends React.Component {
  state = { editGuide: false, editWarn: false, editDesc: false, guideContent: '', waringContent: '', descContnet: '' }

  toggle = (key) => () => {
    this.setState({ [key]: !this.state[key] })
  }

  render() {
    const { editGuide, editWarn, editDesc } = this.state;
    return (
      <div className="container-fluid hotel-upload">
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="IMAGE_AND_VIDEO" /></span>
          <span className="toolbar-right">
            {editGuide
              ? <React.Fragment>
                <Button type="dashed" onClick={this.toggle('editGuide')}><FormattedMessage id="CANCEL" /></Button>
                <Button type="primary"><FormattedMessage id="DONE" /></Button>
              </React.Fragment>
              : <Button type="dashed" onClick={this.toggle('editGuide')}><FormattedMessage id="EDIT_INTRO" /></Button>}
          </span>
        </div>
        {editGuide ? <Editor /> : <Input.TextArea rows={3} readOnly />}
        <Divider />
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="WARING" /></span>
          <span className="toolbar-right">
            {editWarn
              ? <React.Fragment>
                <Button type="dashed" onClick={this.toggle('editWarn')}><FormattedMessage id="CANCEL" /></Button>
                <Button type="primary"><FormattedMessage id="DONE" /></Button>
              </React.Fragment>
              : <Button type="dashed" onClick={this.toggle('editWarn')}><FormattedMessage id="EDIT_WARNING" /></Button>}
          </span>
        </div>
        {editWarn ? <Editor /> : <Input.TextArea rows={3} readOnly />}
        <Divider />
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="SUGGESTION" /></span>
          <span className="toolbar-right">
            {editDesc
              ? <React.Fragment>
                <Button type="dashed" onClick={this.toggle('editDesc')}><FormattedMessage id="CANCEL" /></Button>
                <Button type="primary"><FormattedMessage id="DONE" /></Button>
              </React.Fragment>
              : <Button type="dashed" onClick={this.toggle('editDesc')}><FormattedMessage id="EDIT_SUGGESTION" /></Button>}
          </span>
        </div>
        {editDesc ? <Editor /> : <Input.TextArea rows={3} readOnly />}
      </div>
    )
  }
})