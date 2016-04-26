import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

function ProvideIntl({ intl, children }) {
  return (
    <IntlProvider
      {...intl}
      messages={intl.messages[intl.locale]}
    >
      {children}
    </IntlProvider>
  );
}

ProvideIntl.propTypes = {
  ...IntlProvider.propTypes,
  children: PropTypes.element.isRequired,
};

export default connect(state => ({
  intl: state.intl,
}))(ProvideIntl);
