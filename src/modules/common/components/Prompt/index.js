import React from 'react';
import intl from 'intl';
import cuid from 'cuid';
import { Modal } from 'antd';
import { Prompt } from 'react-router';

class PreventRoute extends React.Component {
  state = { open: false };
  constructor() {
    super();
    this.__trigger = Symbol.for(`__PreventTransitionPrompt_${cuid()}`);
  }

  componentDidMount() {
    window[this.__trigger] = this.show;
  }

  componentWillUnmount() {
    delete window[this.__trigger];
  }

  render() {
    const { when } = this.props;
    return (<Prompt when={when} message={this.onTransition} />)
  }

  show = allowTransitionCallback => {
    const { title, onOk, onCancel, hide } = this.props;
    if (!hide) {
      Modal.confirm({
        title,
        okText: this.props.t('ACT_AGREE'),
        cancelText: this.props.t('ACT_CANCEL'),
        onOk: onOk.bind(this, this.state.location),
        onCancel: onCancel.bind(this, this.state.location)
      })
    }
    allowTransitionCallback(false);
  };

  onTransition = location => {
    this.setState({ location })
    if (this.props.callback) {
      this.props.callback(location)
    }
    return Symbol.keyFor(this.__trigger);
  }
}

PreventRoute.defaultProps = {
  onOk: () => { },
  onCancel: () => { }
}

export default intl(PreventRoute);