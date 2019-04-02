import React from 'react';
import CustomList from './view/CustomList';
import './view/CustomList.less';

const DEFAULT_PAGE_SIZE = 10;

class CustomListWrapper extends React.PureComponent {
  state = {
    places: {
      content: [],
      totalPages: 0,
      currentPage: 0,
      pageSize: DEFAULT_PAGE_SIZE
    },
    addMode: false,
    pop: false
  }

  temp = {};

  openAdd = () => {
    this.temp = {};
    this.setState({ pop: true, addMode: true });
  }

  openModify = (item, e) => {
    e.preventDefault();
    this.temp = item;
    this.setState({ pop: true, addMode: false });
  }

  closePopUp = () => {
    this.setState({ pop: false });
  }

  create = (item) => {
  
  }

  update = (item) => {
   
  }

  remove = (item) => {
  
  }

  componentDidMount() {
   
  }
  render() {
    const actions = {
      onOpenAdd: this.openAdd,
      onOpenModify: this.openModify,
      onClose: this.closePopUp,
      onCreate: this.create,
      onUpdate: this.update,
      onDelete: this.remove
    }
    return (<CustomList {...this.state} actions={actions} temp={this.temp} />)
  }
};

export default CustomListWrapper;