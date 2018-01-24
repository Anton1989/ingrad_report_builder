import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import browserHistory from 'react-router/lib/browserHistory';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
//Components
import PlaceDetails from '../components/PlaceDetails.jsx';

const defaultCoordinates = {
    coordinates: {
        lat: 55.752139,
        lng: 37.633343
    },
    zoom: 10
}

class Map extends React.Component {

    componentDidMount() {
        if (this.props.places.data.length == 0) this.props.getPlaces();
    }

    getDefaultCoordinates(places, activeTypes, type, placeId) {
        if (placeId && places.length > 0) {
            if (activeTypes.indexOf(type) !== -1) {
                let place = places.find(place => place._id == placeId);
                return {
                    coordinates: place.coordinates,
                    zoom: 12
                }
            } else {
                browserHistory.push('/map');
            }
        }
        return defaultCoordinates;
    }

    openPlace(id, type) {
        browserHistory.push('/map/' + type + '/' + id);
    }

    render() {
        const { places, params, activeTypes } = this.props;
        console.log('RENDER <Map>');

        let defaultCoordinates = this.getDefaultCoordinates(places.data, activeTypes, params.type, params.placeId);

        let Maps = withScriptjs(withGoogleMap(() => <GoogleMap
            defaultZoom={defaultCoordinates.zoom}
            defaultCenter={defaultCoordinates.coordinates}
        >
            {places.data && places.data.map(place => {
                if (activeTypes.indexOf(place.location) !== -1) {
                    return <Marker
                        key={place._id}
                        defaultIcon={{ url: place.logo, scaledSize: new google.maps.Size(30, 30) }}
                        position={{ ...place.coordinates }}
                        onClick={() => { this.openPlace(place._id, place.location) }} />
                }
            }
            )}
        </GoogleMap>));

        return <div>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCK5pMR00_zxULM5AVzW5BNfiBpt6svVtk&signed_in=true'
                loadingElement={<div style={{ height: '80%' }} />}
                containerElement={<div style={{ height: '90vh' }} />}
                mapElement={<div style={{ height: '100%' }} />}
            />
            {params.placeId && places.data.length > 0 && <PlaceDetails place={places.data.find(place => place._id == params.placeId)} />}
        </div>;
    }
}
function mapStateToProps(state) {
    return {
        places: state.places
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);