import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlProvider, intlShape } from 'react-intl';

function ProvideIntl({ intl, children }) {
  return (
    <IntlProvider
      key={intl.locale}
      locale={intl.locale}
      initialNow={intl.initialNow}
      messages={intl.messages[intl.locale]}
    >
      {children}
    </IntlProvider>
  );
}

ProvideIntl.propTypes = {
  intl: intlShape,
  children: PropTypes.element.isRequired,
};

export default connect(state => ({
  runtime: state.runtime,
  intl: state.intl,
}))(ProvideIntl);
