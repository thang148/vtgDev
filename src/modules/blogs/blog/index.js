import React from 'react';
import BlogEditable from './BlogEditable';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { initCategories, getPlacesList } from '../blogReudux';
import './Blog.less'

class BlogWrapper extends React.Component {
  ready = (mode, search) => {
    if (mode !== 'CREATE_MODE') {
      this.id = search.split('=')[1];
      if (!this.id)
        window.history.back();
    }
  }

  constructor(props) {
    super(props);
    this.ready(props.mode, props.location.search);
  }

  componentDidMount() {
    this.props.initCategories();
    this.props.getPlacesList();
  }

  render() {
    const { mode, categories, places } = this.props
    return (
      <BlogEditable
        id={this.id}
        places={places}
        categories={categories}
        addMode={mode === 'CREATE_MODE'}
      />
    );
  }
}
const mapProps = (state) => ({
  categories: state.blog.categories,
  places: state.blog.places
})

export default withRouter(connect(mapProps, {
  initCategories,
  getPlacesList
})(BlogWrapper));