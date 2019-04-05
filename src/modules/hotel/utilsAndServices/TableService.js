import React, { Fragment } from 'react';
import { Table } from 'antd';
import Modal from './UtilsModal';
import injectIntl, { FormattedMessage } from 'intl';
import * as Services from './sevices';
const PATH = "https://spetrip.com/vtg/resources/";

// const GRID = { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 };
const DefaultPageSize = 10;

const GetColumns = (props) => ([{
    title: <FormattedMessage tedMessage id="DESCRIPTION" />,
    dataIndex: 'description'
}, {
    title: <FormattedMessage tedMessage id="ICON" />,
    dataIndex: 'icon',
    render: (name) => (<img key={name} alt={name} src={PATH + name} style={stylesImage} />)
}, {
    title: <FormattedMessage tedMessage id="STATUS" />,
    dataIndex: 'status',
    render: (item) => (
        <span>{item ? <FormattedMessage tedMessage id="OPEN" /> : <FormattedMessage tedMessage id="CLOSE" />}</span>
    )
}, {
    title: <FormattedMessage id="ACTION" />,
    key: "city-action",
    width: 128,
    align: 'center',
    render: (item) => (
        <span>
            <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={props.showModalEdit.bind(props, item)}>
                <FormattedMessage id="ACT_MODIFY" />
            </span>
        </span>
    )
}
]);
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
};
export default injectIntl(class TableService extends React.Component {
    state = { modal: false, size: DefaultPageSize, number: 1, totalElements: 0, isUtils: true, content: [] }
    fetch = (pageNo = this.state.number, pageSize = this.state.size) => {
        Services.getAllService({ pageNo, pageSize, type: "HOTEL_SERVICE" }).then((data) => {
            this.setState({ ...data });
        }).catch(() => { })
    }
    columns = GetColumns(this);

    toggle = () => {
        this.setState({ modal: !this.state.modal })
    }

    showModalEdit = (item, e) => {
        e.preventDefault();
        this.data = { ...item };
        this.setState({ modal: true })

    }

    showSizeChanger = (current, pageSize) => {
        this.fetch(current, pageSize);
    }

    componentDidMount() {
        this.fetch();
    }

    render() {
        const { content, modal } = this.state;
        return (
            <Fragment>
                <Table
                    rowKey="id"
                    columns={this.columns}
                    dataSource={content}
                    rowSelection={rowSelection}
                    pagination={{
                        pageSize: this.state.size,
                        showSizeChanger: true,
                        current: this.state.number + 1,
                        total: this.state.totalElements,
                        onChange: this.showSizeChanger,
                        onShowSizeChange: this.showSizeChanger
                    }}
                />

                <Modal
                    fetch={this.fetch}
                    t={this.props.t}
                    visible={modal}
                    isUtils={false}
                    data={this.data}
                    toggle={this.toggle} />
            </Fragment>
        )
    }
})


const stylesImage = {
    width: "64px",
    height: "36px",
    objectfit: "cover",
    overflow: "hidden",
}