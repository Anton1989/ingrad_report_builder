import React from 'react';
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
                props.setPlaceCenter(props.place._id, {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
            },
            onDragEndHouse: () => (e, props, houseInd) => {
                props.setHouseMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                }, houseInd);
            },
            onDragEndCamera: () => (e, props, houseInd) => {
                props.setCameraMarker({
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
            if (house.type == 'house') {
                return [
                    <Polygon
                        key={house.name}
                        paths={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                        options={options}
                    />,
                    stroke,
                    <Marker
                        key={house.name + 'house_number'}
                        label={{
                            text: house.name,
                            color: 'black',
                            fontWeight: 'bold'
                        }}
                        defaultDraggable={true}
                        onDragEnd={(e) => { props.onDragEndHouse(e, props, i) }}
                        icon={image}
                        position={{ lat: parseFloat(house.lat), lng: parseFloat(house.lng) }}
                    />
                ]
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
                    defaultDraggable={true}
                    onDragEnd={(e) => { props.onDragEndCamera(e, props, i) }}
                    icon={icon}
                    position={{ lat: parseFloat(house.coordinates[0].lat), lng: parseFloat(house.coordinates[0].lng) }}
                />
            } else { //tube
                return <Polyline
                    key={house.name}
                    path={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                    options={options}
                />
            }
        })}
        {props.layers && props.layers.map(layer => {
            if (props.toShowLayers.includes(layer._id) && layer.coordinates[0].lat && layer.coordinates[0].lng && 
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
        const { marker, layers, houses, toShowLayers, setPlaceCenter, setHouseMarker, setCameraMarker, mapStyles, place } = this.props;
        console.log('RENDER <EditeMap>');

        return <div className={styles.maps}>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCK5pMR00_zxULM5AVzW5BNfiBpt6svVtk&signed_in=true'
                loadingElement={<div style={{ height: '100%' }} />}
                containerElement={<div className={styles.containerElement} />}
                mapElement={<div style={{ height: '100%' }} />}
                coordinates={marker}
                toShowLayers={toShowLayers}
                houses={houses}
                layers={layers}
                place={place}
                mapStyles={mapStyles}
                setPlaceCenter={setPlaceCenter}
                setCameraMarker={setCameraMarker}
                setHouseMarker={setHouseMarker}
            />
        </div>
    }
}