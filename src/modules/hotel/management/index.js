import React from 'react';
import { Tabs } from 'antd';
import HotelList from './HotelList';
import injectIntl from 'intl';
import { getProvinceList } from 'src/modules/location/services';
import './Management.less';

const TabPane = Tabs.TabPane;

export default injectIntl(class HotelManagement extends React.Component {
  state = { provinces: [] }

  componentDidMount() {
    getProvinceList()
      .then(({ content: provinces }) => {
        this.setState({ provinces })
      })
  }

  render() {
    const { t } = this.props;
    const extendProps = { provinces: this.state.provinces, t };
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <Tabs>
              <TabPane key="0" tab={t("ALL_HOTEL")}>
                <HotelList tab="ALL_HOTEL" {...extendProps} />
              </TabPane>
              <TabPane key="1" tab={t("PENDING_HOTEL")}>
                <HotelList tab="PENDING_HOTEL" {...extendProps} />
              </TabPane>
              <TabPane key="2" tab={t("ACTIVE_HOTEL")}>
                <HotelList tab="ACTIVE_HOTEL" {...extendProps} />
              </TabPane>
              <TabPane key="3" tab={t("BLOCK_HOTEL")}>
                <HotelList tab="BLOCK_HOTEL" {...extendProps} />
              </TabPane>
              <TabPane key="4" tab={t("NEW_HOTEL")}>
                <HotelList tab="NEW_HOTEL" {...extendProps} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>)
  }
})