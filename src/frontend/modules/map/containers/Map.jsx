import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import browserHistory from 'react-router/lib/browserHistory';
import { compose, withStateHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline, InfoWindow } from 'react-google-maps';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
//Components
import PlaceDetails from '../components/PlaceDetails.jsx';
import styles from '../components/Map.scss';

const defaultCoordinates = {
    coordinates: {
        lat: 55.752139,
        lng: 37.633343
    },
    zoom: 10
};

class Map extends React.Component {

    componentDidMount() {
        this.props.getPlaces();
    }

    getDefaultCoordinates(places, activeTypes, type, placeId) {
        if (placeId && places.length > 0) {
            if (activeTypes.indexOf(type) !== -1) {
                let place = places.find(place => place._id == placeId);
                return {
                    coordinates: place.coordinates,
                    zoom: 16
                }
            } else {
                browserHistory.push('/map');
            }
        }
        return defaultCoordinates;
    }

    render() {
        const { places, type, activeTypes, placeId, openPlace } = this.props;
        console.log('RENDER <Map>');

        let defaultCoordinates = this.getDefaultCoordinates(places.data, activeTypes, type, placeId);

        let Maps = compose(
            withStateHandlers(
                () => ({
                    infoWindow: null,
                }),
                {
                    onToggleOpen: () => (event, house) => {
                        return ({
                            infoWindow: {
                                position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                                house
                            }
                        })
                    },
                    onToggleClose: () => () => {
                        return ({
                            infoWindow: null
                        })
                    }
                }
            ),
            withScriptjs,
            withGoogleMap
        )(props => {
            return <GoogleMap
                defaultZoom={defaultCoordinates.zoom}
                defaultCenter={defaultCoordinates.coordinates}
            >
                {places.data && places.data.map(place => {
                    if (activeTypes.indexOf(place.location) !== -1) {
                        let placeHtml = null;
                        if (placeId && place.houses.length > 0 && placeId == place._id) {
                            placeHtml = place.houses.map(house => {
                                if (house.type == 'house' || house.type == 'camera') {
                                    return <Polygon
                                        key={house.name}
                                        paths={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                                        onClick={(event) => { props.onToggleOpen(event, house) }}
                                        options={{
                                            strokeColor: house.color,
                                            strokeOpacity: 0.8,
                                            strokeWeight: 2,
                                            fillColor: house.color,
                                            fillOpacity: 0.35
                                        }}
                                    />
                                } else { //tube
                                    return <Polyline
                                        key={house.name}
                                        path={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                                        onClick={(event) => { props.onToggleOpen(event, house) }}
                                        options={{
                                            strokeColor: house.color,
                                            strokeOpacity: 0.8,
                                            strokeWeight: 3,
                                            fillColor: house.color,
                                            fillOpacity: 0.35
                                        }}
                                    />
                                }
                            });
                        } else {
                            placeHtml = <Marker
                                key={place._id}
                                defaultIcon={{ url: place.logo, scaledSize: new google.maps.Size(30, 30) }}
                                position={{ ...place.coordinates }}
                                onClick={() => { openPlace(place.location, place._id) }} />;
                        }
                        return placeHtml;
                    }
                })}
                {props.infoWindow && <InfoWindow
                    onCloseClick={props.onToggleClose}
                    position={props.infoWindow.position}
                >
                    <p>
                        <b>{props.infoWindow.house.name}</b><br/>
                        {props.infoWindow.house.type == 'camera' && <iframe src={props.infoWindow.house.camera} height="200" width="300"></iframe>}
                        {props.infoWindow.house.type != 'camera' && <span>Статус <b>{props.infoWindow.house.status}</b></span>}
                        <br/>
                    </p>
                </InfoWindow>}
            </GoogleMap>
        });
        return <div className={styles.maps}>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCK5pMR00_zxULM5AVzW5BNfiBpt6svVtk&signed_in=true'
                loadingElement={<div style={{ height: '80%' }} />}
                containerElement={<div className={styles.containerElement} />}
                mapElement={<div style={{ height: '100%' }} />}
            />
            {placeId && places.data.length > 0 && <PlaceDetails place={places.data.find(place => place._id == placeId)} />}
            {this.props.children}
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