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

import config from '../../../config';

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
            infoWindow: null,
            map: null
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
            },
            handleMapLoad: () => (map) => {
                return ({
                    map
                })
            },
            handleZoomChanged: () => (map) => {
                return ({
                    zoom: map.getZoom()
                })
            },
            // (map) { this._mapComponent = map; if (map) { console.log(map.getZoom()); } }
        }
    ),
    withScriptjs,
    withGoogleMap
)(props => {
    const { mapStyles, places, activeTypes, placeId, openPlace, defaultCoordinates, selectedLayer, open360, map/*, zoom*/ } = props;
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
        },
        styles: config.mapStyle
    }
    return <GoogleMap
        ref={props.handleMapLoad}
        zoom={defaultCoordinates.zoom}
        center={defaultCoordinates.coordinates}
        defaultOptions={options}
        onZoomChanged={() => {
            props.handleZoomChanged(map);
        }}>
        {places.data && places.data.map(place => {
            if (activeTypes.indexOf(place.location) !== -1) {
                let placeHtml = null;
                if (placeId && mapStyles.length > 0 && placeId == place._id && (place.panarams || place.houses.length > 0)) {
                    placeHtml = [];
                    if (place.houses.length > 0) {
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
                            if (house.type == 'house') {
                                const image = {
                                    url: '/images/blank.png',
                                    size: new google.maps.Size(20, 20),
                                    origin: new google.maps.Point(0, 0),
                                    anchor: new google.maps.Point(10, 10)
                                };
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
                                    stroke,
                                    // (map && zoom > 17) ? <Marker
                                    (map) ? <Marker
                                        key={house._id + 'house_number'}
                                        label={{
                                            text: house.name,
                                            color: '#f9c434',
                                            fontWeight: 'bold'
                                        }}
                                        icon={image}
                                        position={(house.lat && house.lng) ? { lat: parseFloat(house.lat), lng: parseFloat(house.lng) } : { ...house.coordinates[0] }} /> : null
                                ];
                            } else if(house.type == 'camera') {
                                const icon = {
                                    path: 'M600 1809 c-14 -6 -36 -20 -48 -32 -53 -49 -52 -41 -52 -563 0 -471 1 -488 20 -519 36 -59 63 -69 189 -75 l113 -5 -119 -135 c-66 -74 -125 -145 -131 -157 -24 -44 -7 -103 35 -122 16 -7 147 -11 404 -11 l380 0 24 25 c18 18 25 35 25 65 0 36 -8 49 -82 131 -46 50 -107 118 -136 150 l-54 59 110 0 c120 0 150 11 196 73 21 28 21 39 24 512 3 539 4 530 -64 581 l-37 29 -386 2 c-243 1 -395 -2 -411 -8z m720 -589 l0 -420 -320 0 -320 0 0 420 0 420 320 0 320 0 0 -420z m-251 -848 c-38 -2 -101 -2 -140 0 l-70 3 68 78 68 78 71 -78 72 -78 -69 -3z',
                                    fillColor: '#f9c434',
                                    strokeColor: '#f9c434',
                                    strokeWeight: 2,
                                    size: new google.maps.Size(20, 20),
                                    origin: new google.maps.Point(0, 0),
                                    anchor: new google.maps.Point(10, 10),
                                    scale: .015,
                                    rotation: parseInt(house.ugol)
                                };
                                return <Marker
                                    key={house.name + 'camera_number'}
                                    onClick={(event) => { props.onToggleOpen(event, house) }}
                                    icon={icon}
                                    position={{ lat: parseFloat(house.coordinates[0].lat), lng: parseFloat(house.coordinates[0].lng) }}
                                />
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
                    }
                    
                    if (place.panarams) {
                        placeHtml.push(place.panarams.map(img360 => {
                            if (img360.coordinates.lat && img360.coordinates.lng && img360.src) {
                                return  <Marker
                                    key={img360._id}
                                    defaultIcon={{ url: '/images/360-icon.png', scaledSize: new google.maps.Size(30, 30) }}
                                    position={{ ...img360.coordinates }}
                                    onClick={() => { open360(img360) }} />;
                            }
                        }));
                    }
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
                new google.maps.LatLng(selectedLayer.coordinates[1].lat, selectedLayer.coordinates[1].lng)
            )}
            defaultOpacity={selectedLayer.opcity}
        />}
    </GoogleMap>
});

class Map extends React.Component {

    constructor() {
        super();

        this.state = {
            selectedLayer: null,
            img360: null
        }

        this.onSelectLayer = this.onSelectLayer.bind(this);
        this.handleOpen360 = this.handleOpen360.bind(this);
    }

    componentDidMount() {
        if (this.props.places.data.length == 0) {
            this.props.getPlaces();
        }
        if (this.props.mapStyles.data.length == 0) {
            this.props.getStyles();
        }
    }

    handleOpen360(img360) {
        this.setState({ img360 });
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
        const { places, type, activeTypes, placeId, params: { id }, openPlace, mapStyles } = this.props;
        console.log('RENDER <Map>');

        const ID = id ? id : placeId;
        const placeObj = places.data.find(place => place._id == ID);
        const TYPE = (id && placeObj) ? placeObj.location : type;

        let defaultCoordinates = this.getDefaultCoordinates(places.data, activeTypes, TYPE, ID);

        let detailStyle = ID && places.data.length > 0 ? styles.detail : '';
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
                placeId={ID}
                openPlace={openPlace}
                open360={this.handleOpen360}
                defaultCoordinates={defaultCoordinates}
            />
            {ID && places.data.length > 0 && <PlaceDetails selectedLayer={this.state.selectedLayer} onSelectLayer={this.onSelectLayer} place={placeObj} />}
            {this.state.img360 && <div className={styles.img360}>
                <a href='#' onClick={e => { this.handleOpen360(null); e.preventDefault(); }}><span className='glyphicon glyphicon-chevron-left'></span> Назад к проекту</a>
                <iframe src={ENV_360_URL + '?img=https://' + ENV_HOST + this.state.img360.src}></iframe>
            </div>}
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