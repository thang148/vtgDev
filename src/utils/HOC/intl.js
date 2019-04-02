import React from 'react';
import { injectIntl, FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';

export default function inject(Component) {
  class WrappIntl extends React.Component {
    t = (id, values) => (this.props.intl.formatMessage({ id }, values))
    render = () => (<Component t={this.t} {...this.props} />)
  }
  WrappIntl.displayName = `Intl${getDisplayName(Component)}`;
  return injectIntl(WrappIntl)
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export {
  FormattedDate,
  FormattedMessage,
  FormattedNumber
}