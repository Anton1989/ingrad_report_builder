import React from 'react';
import PropTypes from 'prop-types';
import styles from './Map.scss';
import { compose, withStateHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, Marker, Polygon, Polyline, GoogleMap, GroundOverlay } from 'react-google-maps';

const defaultCoordinates = {
    coordinates: {
        lat: 55.752139,
        lng: 37.633343
    },
    zoom: 10
};

const Maps = compose(
    withStateHandlers(() => ({
        zoom: defaultCoordinates.coordinates.zoom,
        map: undefined
    }), {
            onMapMounted: () => ref => ({
                map: ref
            }),
            onZoomChanged: ({ map }) => () => ({
                zoom: map.getZoom()
            }),
            onDragEnd: () => (e, props) => {
                props.setMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
            },
            onDragEndHouse: () => (e, props, houseInd) => {
                props.setHouseMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                }, houseInd);
            }
        }),
    withScriptjs,
    withGoogleMap
)((props) => {
    let center = null;
    let zoom = defaultCoordinates.coordinates.zoom;
    if(props.coordinates && props.coordinates.lng && props.coordinates.lat) {
        center = props.coordinates;
        zoom = 15;
    }

    const image = {
        url: '/images/blank.png',
        size: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
    };

    return <GoogleMap
        zoom={zoom}
        center={center ? center : defaultCoordinates.coordinates}
        ref={props.onMapMounted}
        onZoomChanged={props.onZoomChanged}
    >
        {center && <Marker
            position={center}
            defaultDraggable={true}
            onDragEnd={(e) => { props.onDragEnd(e, props) }}
        />}
        {props.houses && props.houses.length > 0 && props.mapStyles.length > 0 && props.houses.map((house, i) => {
            let style = props.mapStyles.find(style => style._id == house.style);
            if (!style) {
                style = props.mapStyles[0];
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
                let label = null;
                if (house.type == 'house') {
                    label = <Marker
                        key={house.name + 'house_number'}
                        label={{
                            text: house.name,
                            color: 'black',
                            fontWeight: 'bold'
                        }}
                        defaultDraggable={true}
                        onDragEnd={(e) => { props.onDragEndHouse(e, props, i) }}
                        icon={image}
                        position={{ lat: parseFloat(house.lat), lng: parseFloat(house.lng) }} />
                }
                return [
                    <Polygon
                        key={house.name}
                        paths={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                        options={options}
                    />,
                    stroke,
                    label
                ]
            } else { //tube
                return <Polyline
                    key={house.name}
                    path={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                    options={options}
                />
            }
        })}
        {props.layers.map(layer => {
            if (layer.show && layer.coordinates[0].lat && layer.coordinates[0].lng && 
                layer.coordinates[1].lat && layer.coordinates[1].lng && layer.image) {
                return <GroundOverlay
                    key={JSON.stringify(layer)}
                    defaultUrl={layer.image.preview ? layer.image.preview: layer.image}
                    defaultBounds={new google.maps.LatLngBounds(
                        new google.maps.LatLng(layer.coordinates[0].lat, layer.coordinates[0].lng),
                        new google.maps.LatLng(layer.coordinates[1].lat, layer.coordinates[1].lng)
                    )}
                    defaultOpacity={layer.opcity}
                />
            }
        })}
    </GoogleMap>
});

export default class EditeMap extends React.Component {

    render() {
        const { marker, layers, houses, setMarker, setHouseMarker, mapStyles } = this.props;
        console.log('RENDER <PlaceDetails>');

        return <div className={styles.maps}>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCK5pMR00_zxULM5AVzW5BNfiBpt6svVtk&signed_in=true'
                loadingElement={<div style={{ height: '100%' }} />}
                containerElement={<div className={styles.containerElement} />}
                mapElement={<div style={{ height: '100%' }} />}
                coordinates={marker}
                houses={houses}
                layers={layers}
                mapStyles={mapStyles}
                setMarker={setMarker}
                setHouseMarker={setHouseMarker}
            />
        </div>
    }
}

EditeMap.propTypes = {
    marker: PropTypes.object,
    setMarker: PropTypes.func.isRequired,
}