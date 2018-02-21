import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import browserHistory from 'react-router/lib/browserHistory';
import { compose, withStateHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline, InfoWindow } from 'react-google-maps';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
import { getStyles } from '../../styles/actions/stylesActions';
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
        if (this.props.places.data.length == 0) {
            this.props.getPlaces();
        }
        if (this.props.mapStyles.data.length == 0) {
            this.props.getStyles();
        }
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
        const { places, type, activeTypes, placeId, openPlace, mapStyles } = this.props;
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
                        if (placeId && place.houses.length > 0 && props.mapStyles.length > 0 && placeId == place._id) {
                            placeHtml = place.houses.map(house => {
                                let style = props.mapStyles.find(style => style._id == house.style);
                                let options = {
                                    strokeColor: style.strokColor,
                                    strokeOpacity: style.strokeOpacity,
                                    strokeWeight: style.width,
                                    fillColor: style.color,
                                    fillOpacity: style.fillOpacity
                                };
                                let stroke = null;
                                if (style.lineStyle == 'dashed') {
                                    let optionsStroke = { ...options };
                                    optionsStroke.icons = [{
                                        icon: {
                                            path: 'M 0,-1 0,1',
                                            strokeOpacity: style.strokeOpacity,
                                            scale: 4
                                        },
                                        offset: '0',
                                        repeat: '20px'
                                    }];
                                    let path = house.coordinates.filter(cd => cd.lat != '' && cd.lng != '');
                                    path.push(path[0]);
                                    stroke = <Polyline
                                        key={'stroke_' + house.name}
                                        path={path}
                                        options={optionsStroke}
                                    />
                                    options.strokeOpacity = 0;
                                }
                                if (house.type == 'house' || house.type == 'camera') {
                                    return [
                                        <Polygon
                                            key={house.name}
                                            paths={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                                            onClick={(event) => { props.onToggleOpen(event, house) }}
                                            options={{
                                                strokeColor: style.strokColor,
                                                strokeOpacity: style.strokeOpacity,
                                                strokeWeight: style.width,
                                                fillColor: style.color,
                                                fillOpacity: style.fillOpacity
                                            }}
                                        />,
                                        stroke
                                    ];
                                } else { //tube
                                    return <Polyline
                                        key={house.name}
                                        path={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                                        onClick={(event) => { props.onToggleOpen(event, house) }}
                                        options={{
                                            strokeColor: style.strokColor,
                                            strokeOpacity: style.strokeOpacity,
                                            strokeWeight: style.width,
                                            fillColor: style.color,
                                            fillOpacity: style.fillOpacity
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
                        <span>Название <b>{props.infoWindow.house.name}</b></span><br />
                        {props.infoWindow.house.type == 'camera' && <iframe src={props.infoWindow.house.camera} height='200' width='300'></iframe>}
                        {props.infoWindow.house.type != 'camera' && <span>Статус <b>{props.infoWindow.house.status}</b></span>}
                        <br />
                    </p>
                </InfoWindow>}
            </GoogleMap>
        });
        return <div className={styles.maps}>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyD1LROGB0tFWgOxT-vFa7a2f-dpJTLEXgs&signed_in=true'
                loadingElement={<div style={{ height: '80%' }} />}
                containerElement={<div className={styles.containerElement} />}
                mapElement={<div style={{ height: '100%' }} />}
                mapStyles={mapStyles.data}
            />
            {placeId && places.data.length > 0 && <PlaceDetails place={places.data.find(place => place._id == placeId)} />}
            {this.props.children}
        </div>;
    }
}
function mapStateToProps(state) {
    return {
        mapStyles: state.styles,
        places: state.places
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getStyles: bindActionCreators(getStyles, dispatch),
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);