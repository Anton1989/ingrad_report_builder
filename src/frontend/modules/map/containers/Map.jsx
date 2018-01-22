import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
//Components
// import List from '../components/List.jsx';


class Map extends React.Component {

    componentDidMount() {
        if (this.props.places.data.length == 0) this.props.getPlaces();
    }

    render() {
        const { places } = this.props;
        console.log('RENDER <Map>');

        let Maps = withScriptjs(withGoogleMap(() => <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: 55.752139, lng: 37.633343 }}
        >
            {places.data && places.data.map(place => 
                <Marker
                    key={place._id}
                    defaultIcon={{ url: place.logo, scaledSize: new google.maps.Size(25, 25) }}
                    position={{ ...place.coordinates }} />
            )}
        </GoogleMap>));

        return <Maps
            googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCK5pMR00_zxULM5AVzW5BNfiBpt6svVtk&signed_in=true'
            loadingElement={<div style={{ height: '80%' }} />}
            containerElement={<div style={{ height: '90vh' }} />}
            mapElement={<div style={{ height: '100%' }} />} />;
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