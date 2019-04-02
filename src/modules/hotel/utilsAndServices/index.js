import React from 'react';
import Modal from './UtilsModal';
import { Button, List } from 'antd';
import injectIntl, { FormattedMessage } from 'intl';

const GRID = { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 };

export default injectIntl(class HotelUtilsAndServices extends React.Component {
  state = { modal: false, isUtils: true, addMode: false, utils: [], services: [] }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  onAddUtils = () => {
    this.setState({ modal: true, isUtils: true, addMode: true })
  }

  onAddServices = () => {
    this.setState({ modal: true, isUtils: false, addMode: true })
  }

  onEditUtils = (item) => {
    this.data = item;
    this.setState({ modal: true, isUtils: true, addMode: false })
  }

  onEditService = (item) => {
    this.data = item;
    this.setState({ modal: true, isUtils: false, addMode: false })
  }

  onRenderItem = () => {
    return (
      <List.Item>
        Card content
      </List.Item>)
  }

  render() {
    const { utils, services, modal, isUtils, addMode } = this.state;
    return (
      <div className="container-fluid hotel-utils-and-services">
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="UTILS" /></span>
          <span className="toolbar-right">
            <Button type="primary" onClick={this.onAddUtils}><FormattedMessage id="ADD_UTILS" /></Button>
          </span>
        </div>
        <List
          grid={GRID}
          dataSource={utils}
          renderItem={this.onRenderItem} />
        <div className="table-toolbar">
          <span className="toolbar-left"><FormattedMessage id="SERVICES" /></span>
          <span className="toolbar-right">
            <Button type="primary" onClick={this.onAddServices}><FormattedMessage id="ADD_SERVICES" /></Button>
          </span>
        </div>
        <List
          grid={GRID}
          dataSource={services}
          renderItem={this.onRenderItem} />
        <Modal
          t={this.props.t}
          visible={modal}
          isUtils={isUtils}
          addMode={addMode}
          data={this.data}
          toggle={this.toggle} />
      </div>)
  }
})