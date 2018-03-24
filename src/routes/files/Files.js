/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Dropzone from 'react-dropzone';
import { Button } from 'react-bootstrap';
import s from './Files.css';
import FilesList from '../../components/FilesList';

class Files extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      filesSelected: false,
    };
  }

  handleFileUpload(files) {
    this.setState({
      filesSelected: true,
      file: files[0],
      fileName: files[0].name,
    });
  }

  async uploadFile() {
    const data = new FormData();
    data.append(
      'query',
      `mutation uploadFile($internalName: String!, $userId: String!) {
        uploadFile(internalName: $internalName, userId: $userId) { id }
      }`,
    );
    data.append(
      'variables',
      JSON.stringify({
        userId: this.context.store.getState().user.id,
        internalName: this.state.fileName,
      }),
    );
    data.append('file', this.state.file);
    await this.context.fetch('/graphql', {
      body: data,
    });
  }

  render() {
    const { file, filesSelected } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <FilesList files={this.props.files} />
          {/* <input type="file" onChange={e => this.handleFileUpload(e)} />
          <input
            type="button"
            value="upload"
            onClick={() => this.uploadFile()}
          /> */}
          <Dropzone onDrop={e => this.handleFileUpload(e)}>
            {file ? (
              file.name
            ) : (
              <p>
                Try dropping some files here, or click to select files to
                upload.
              </p>
            )}
          </Dropzone>
          <Button
            bsStyle="primary"
            disabled={!filesSelected}
            onClick={() => this.uploadFile()}
          >
            Upload
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Files);
