import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';

class GMap extends Component {

  static propTypes = {
    googleMaps: PropTypes.shape({
      apiKey: React.PropTypes.string,
    }).isRequired,
    center: PropTypes.shape({
      lat: React.PropTypes.number,
      lng: React.PropTypes.number,
    }),
    zoom: React.PropTypes.number,
    language: PropTypes.string,
  };

  static defaultProps = {
    center: { lat: 50.209251, lng: 15.832789 },
    zoom: 9,
  };

  render() {
    const { googleMaps, language } = this.props;
    return (
      <GoogleMap
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        bootstrapURLKeys={{
          key: googleMaps.apiKey,
          language,
        }}
      />
    );
  }
}

const mapState = state => ({
  googleMaps: state.runtime.google.maps,
  language: state.intl.locale,
});

export default connect(mapState)(GMap);
