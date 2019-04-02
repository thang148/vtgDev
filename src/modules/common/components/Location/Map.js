import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap
} from 'react-google-maps';

const DEFAULT_ZOOM = 14;
const DEFAULT_CENTER = { lat: 21.027706, lng: 105.834303 };

const Map = () => (
  <GoogleMap
    onClick={({ latLng }) => { console.log(latLng.lat()) }}
    center={DEFAULT_CENTER}
    defaultZoom={DEFAULT_ZOOM}>
  </GoogleMap>
)


export default withScriptjs(withGoogleMap(Map))