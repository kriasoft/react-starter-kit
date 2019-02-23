import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './Files.css';
import FilesList from '../../components/FilesList';

class Files extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  render() {
    const { title, files } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <FilesList files={files} />
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  files: state.files.items,
});

export default connect(mapState)(withStyles(s)(Files));
