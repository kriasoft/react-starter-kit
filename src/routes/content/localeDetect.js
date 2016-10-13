import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import fetch from '../../core/fetch';

const query = `
  query($path:String!,$locale:String!) {
    content(path:$path,locale:$locale) {
      content,
    }
  }
`;

function localeDetect(MyComponent) {
  class LocaleSwitcher extends Component {
    static propTypes = {
      path: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    };
    static contextTypes = {
      intl: PropTypes.shape({
        locale: PropTypes.string.isRequired,
      }).isRequired,
    };
    state = {
      content: '',
    };
    componentDidUpdate(prevProp, prevState, prevContext) {
      if (prevContext.intl.locale !== this.context.intl.locale) {
        const { path } = this.props;
        const { locale } = this.context.intl;
        const variables = { path, locale };
        fetch('/graphql', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables }),
          credentials: 'include',
        }).then(res => res.json())
          .then(res => res.data.content)
          .then(({ content }) => this.setState({ content }));
      }
    }
    render() {
      return (
        <MyComponent
          {...this.props}
          content={this.state.content || this.props.content}
        />
      );
    }
  }

  return injectIntl(LocaleSwitcher);
}

export default localeDetect;
