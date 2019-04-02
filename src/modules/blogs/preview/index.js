import React from 'react';
import { Button } from 'antd';
import { RESOURCES_PATH } from 'consts';
import { FormattedMessage } from 'intl';
import { getBlog } from '../BlogServices';
import { withRouter, Link } from 'react-router-dom';
import './preview.less';

class Blog extends React.Component {
  state = { post: {}, loading: false }

  componentDidMount() {
    getBlog(this.props.match.params.id)
      .then((data) => {
        this.setState({ post: data })
      })
  }

  render = () => {
    const { post } = this.state;
    return (
      <div className="container preview">
        <div className="preview__banner">
          <img src={RESOURCES_PATH + post.bannerContentName} alt="banner" />
          <div className="banner">
            <h4 className="banner__title text text--2l">{post.title}</h4>
            <div className="banner__info">
              <span>{post.author}</span>
              <span>{post.createdDate}</span>
            </div>
          </div>
          <span className="banner__tag">{post.province}</span>
          <div className="banner__act">
            <Link to={`/blog/modify?post=${post.id}`}>
              <Button type="primary">
                <FormattedMessage id="EDIT_POST" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="preview__content">
          <div>{post.introduction}</div>
          <div className="html-viewer" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>);
  }
}

export default withRouter(Blog);