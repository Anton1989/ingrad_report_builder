import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import browserHistory from 'react-router/lib/browserHistory';
import { compose, withStateHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline, InfoWindow, GroundOverlay } from 'react-google-maps';
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

const Maps = compose(
    withStateHandlers(
        () => ({
            infoWindow: null
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
    const { mapStyles, places, activeTypes, placeId, openPlace, defaultCoordinates, selectedLayer } = props;
    let options = {
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    }
    return <GoogleMap
        zoom={defaultCoordinates.zoom}
        center={defaultCoordinates.coordinates}
        defaultOptions={options}
    >
        {places.data && places.data.map(place => {
            if (activeTypes.indexOf(place.location) !== -1) {
                let placeHtml = null;
                if (placeId && place.houses.length > 0 && mapStyles.length > 0 && placeId == place._id) {
                    placeHtml = place.houses.map(house => {
                        let style = mapStyles.find(style => style._id == house.style);
                        if (!style) {
                            style = mapStyles[0];
                        }
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
                } else if (!placeId || placeId == place._id) {
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
        {selectedLayer && <GroundOverlay
            defaultUrl={selectedLayer.image}
            defaultBounds={new google.maps.LatLngBounds(
                new google.maps.LatLng(selectedLayer.coordinates[0].lat, selectedLayer.coordinates[0].lng),
                new google.maps.LatLng(selectedLayer.coordinates[1].lat, selectedLayer.coordinates[1].lng),
                selectedLayer.coordinates[1]
            )}
            defaultOpacity={selectedLayer.opcity}
        />}
    </GoogleMap>
});

class Map extends React.Component {

    constructor() {
        super();

        this.state = {
            selectedLayer: null
        }

        this.onSelectLayer = this.onSelectLayer.bind(this);
    }

    componentDidMount() {
        if (this.props.places.data.length == 0) {
            this.props.getPlaces();
        }
        if (this.props.mapStyles.data.length == 0) {
            this.props.getStyles();
        }
    }

    onSelectLayer(layer) {
        if (this.state.selectedLayer !== null && layer._id == this.state.selectedLayer._id) {
            this.setState({
                selectedLayer: null
            });
        } else {
            this.setState({
                selectedLayer: layer
            });
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
                browserHistory.push('/');
            }
        }
        return defaultCoordinates;
    }

    render() {
        const { places, type, activeTypes, placeId, openPlace, mapStyles } = this.props;
        console.log('RENDER <Map>');

        let defaultCoordinates = this.getDefaultCoordinates(places.data, activeTypes, type, placeId);

        let detailStyle = placeId && places.data.length > 0 ? styles.detail : '';
        return <div className={styles.maps + ' ' + detailStyle}>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCK5pMR00_zxULM5AVzW5BNfiBpt6svVtk&signed_in=true'
                loadingElement={<div style={{ height: '80%' }} />}
                containerElement={<div className={styles.containerElement} />}
                mapElement={<div style={{ height: '100%' }} />}
                mapStyles={mapStyles.data}
                places={places}
                selectedLayer={this.state.selectedLayer}
                activeTypes={activeTypes}
                placeId={placeId}
                openPlace={openPlace}
                defaultCoordinates={defaultCoordinates}
            />
            {placeId && places.data.length > 0 && <PlaceDetails selectedLayer={this.state.selectedLayer} onSelectLayer={this.onSelectLayer} place={places.data.find(place => place._id == placeId)} />}
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