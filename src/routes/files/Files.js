import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './Files.css';
import FilesList from '../../components/FilesList';
import UploadForm from '../../components/UploadForm';
import { addFile } from '../../actions/files';

class Files extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  handleFileUpload = async files => {
    const { dispatch } = this.props;
    const { fetch } = this.context;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append(
      'query',
      `mutation uploadFile($internalName: String!) {
        uploadFile(internalName: $internalName) { id internalName user { id } }
      }`,
    );
    formData.append(
      'variables',
      JSON.stringify({
        internalName: files[0].name,
      }),
    );
    try {
      const resp = await fetch('/graphql', {
        body: formData,
      });
      const { data } = await resp.json();
      dispatch(addFile(data.uploadFile));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { title, files } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <FilesList files={files} />
          <UploadForm onUpload={this.handleFileUpload} />
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  files: state.files.items,
});

export default connect(mapState)(withStyles(s)(Files));
