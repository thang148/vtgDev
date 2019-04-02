import React from 'react';
import { Table, Divider, Button, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

class CustomList extends React.Component {
  getColumn(type = 0) {
    const columns = [
      {
        title: <FormattedMessage id="DETAIL" />,
        dataIndex: 'description',
      },
      {
        title: <FormattedMessage id="ACTION" />,
        key: "country-action",
        width: 128,
        render: (item) => (
          <span>
            <a href="/" onClick={this.props.actions.onOpenModify.bind(this, item)}>
              <FormattedMessage id="ACT_MODIFY" />
            </a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title={<FormattedMessage id="DELETE_CONFIRM" />}
              onConfirm={this.props.actions.onDelete.bind(this, item)}
              okText={<FormattedMessage id="ACT_DELETE" />}
              cancelText={<FormattedMessage id="ACT_CANCEL" />}
            >
              <a href="/"><FormattedMessage id="ACT_DELETE" /></a>
            </Popconfirm>
          </span>
        )
      }];
    let id = type === 0 ? 'CURRENTCY_UNIT' : type === 1 ? 'PAYMENT_METHOD_NAME' : 'BANK_NAME';
    switch (type) {
      case 0:
      case 1:
      case 2:
        columns.unshift({
          title: <FormattedMessage id="ABBR" />,
          dataIndex: 'abbr',
        });
        columns.unshift(
          {
            title: <FormattedMessage id={id} />,
            dataIndex: 'name',
          });
        break;
      default:
        columns.unshift({
          title: <FormattedMessage id="PRICE_RANGE" />,
          dataIndex: 'name',
        });
        break;
    }
    return columns;
  }
  render() {
    const { places, actions } = this.props;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="bgc-white bd bdrs-3 p-20 mB-20">
                <div className="table-toolbar">
                  <span className="toolbar-left"><FormattedMessage id="CURRENTCY_UNIT" /></span>
                  <span className="toolbar-right">
                    <Button type="primary" onClick={actions.onOpenAdd}>
                      <FormattedMessage id="ADD_CURRENTCY" />
                    </Button>
                  </span>
                </div>
                <Table rowKey="id" columns={this.getColumn(0)} dataSource={places.content} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="bgc-white bd bdrs-3 p-20 mB-20">
                <div className="table-toolbar">
                  <span className="toolbar-left"><FormattedMessage id="PAYMENT_TYPE" /></span>
                  <span className="toolbar-right">
                    <Button type="primary" onClick={actions.onOpenAdd}>
                      <FormattedMessage id="ADD_PAYMENT_TYPE" />
                    </Button>
                  </span>
                </div>
                <Table rowKey="id" columns={this.getColumn(1)} dataSource={places.content} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="bgc-white bd bdrs-3 p-20 mB-20">
                <div className="table-toolbar">
                  <span className="toolbar-left"><FormattedMessage id="BANKING" /></span>
                  <span className="toolbar-right">
                    <Button type="primary" onClick={actions.onOpenAdd}>
                      <FormattedMessage id="ADD_BANK" />
                    </Button>
                  </span>
                </div>
                <Table rowKey="id" columns={this.getColumn(2)} dataSource={places.content} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="bgc-white bd bdrs-3 p-20 mB-20">
                <div className="table-toolbar">
                  <span className="toolbar-left"><FormattedMessage id="PRICE_RANGE" /></span>
                  <span className="toolbar-right">
                    <Button type="primary" onClick={actions.onOpenAdd}>
                      <FormattedMessage id="ADD_PRICE_RANGE" />
                    </Button>
                  </span>
                </div>
                <Table rowKey="id" columns={this.getColumn(3)} dataSource={places.content} />
              </div>
            </div>
          </div >
        </div >
        {/* {pop &&
          <PopPlaces
            addMode={addMode}
            onClose={actions.onClose}
            onDone={addMode ? actions.onCreate : actions.onUpdate}
            temp={temp} />} */}
      </React.Fragment >
    );
  }
}

export default CustomList;