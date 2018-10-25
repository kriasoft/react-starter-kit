import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import { Button, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UploadForm.css';

class UploadForm extends Component {
  static propTypes = {
    onUpload: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  onDrop = files =>
    this.setState(state => ({ files: state.files.concat(files) }));

  handleSubmit = e => {
    e.preventDefault();
    const { files } = this.state;
    const { onUpload } = this.props;
    onUpload(files);
    this.setState({ files: [] });
  };

  render() {
    const { files } = this.state;
    return (
      <form encType="multipart/form-data">
        <FormGroup controlId="dropzone">
          <ControlLabel>File upload</ControlLabel>
          <Dropzone className={s.dropzone} onDrop={this.onDrop}>
            {files.length > 0 ? (
              files.map(file => (
                <p key={file.lastModified}>{`${file.name} `}</p>
              ))
            ) : (
              <HelpBlock>Drop some files here, or click to select.</HelpBlock>
            )}
          </Dropzone>
        </FormGroup>
        <Button
          type="submit"
          bsStyle="primary"
          disabled={!files.length}
          onClick={this.handleSubmit}
        >
          Upload
        </Button>
      </form>
    );
  }
}

export default withStyles(s)(UploadForm);
