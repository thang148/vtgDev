import React from 'react';
import RoomType from './RoomType';
import RoomList from './RoomList';
import RoomDirection from './RoomDirection';
import RoomConvenient from './RoomConvenient';

export default class RoomManagement extends React.Component {
  state = { content: [] }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <RoomType />
            <div style={{ height: 50 }} />
            <RoomList />
            <div style={{ height: 50 }} />
            <RoomDirection />
            <div style={{ height: 50 }} />
            <RoomConvenient />
          </div>
        </div>
      </div>)
  }
}