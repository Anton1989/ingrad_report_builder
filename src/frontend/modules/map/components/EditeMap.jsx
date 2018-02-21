import React from 'react';
import PropTypes from 'prop-types';
import styles from './Map.scss';
import { compose, withStateHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, Marker, Polygon, Polyline, GoogleMap } from 'react-google-maps';

const defaultCoordinates = {
    coordinates: {
        lat: 55.752139,
        lng: 37.633343
    },
    zoom: 10
};

const Maps = compose(
    withStateHandlers(() => ({
        zoom: 10,
        map: undefined
    }), {
            onMapMounted: () => ref => ({
                map: ref
            }),
            onZoomChanged: ({ map }) => () => ({
                zoom: map.getZoom()
            }),
            onDragEnd: () => (e, props) => {
                console.log('props.setMarker', {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                })
                props.setMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
            }
        }),
    withScriptjs,
    withGoogleMap
)((props) => {
    return <GoogleMap
        zoom={props.zoom}
        defaultCenter={defaultCoordinates.coordinates}
        ref={props.onMapMounted}
        onZoomChanged={props.onZoomChanged}
    >
        {props.coordinates && props.coordinates.lng && props.coordinates.lat && <Marker
            position={props.coordinates}
            defaultDraggable={true}
            onDragEnd={(e) => { props.onDragEnd(e, props) }}
        />}
        {props.houses && props.houses.length > 0 && props.mapStyles.length > 0 && props.houses.map(house => {
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
                        options={options}
                    />,
                    stroke
                ]
            } else { //tube
                return <Polyline
                    key={house.name}
                    path={house.coordinates.filter(cd => cd.lat != '' && cd.lng != '')}
                    options={options}
                />
            }
        })}
    </GoogleMap>
});

export default class EditeMap extends React.Component {

    render() {
        const { marker, houses, setMarker, mapStyles } = this.props;
        console.log('RENDER <PlaceDetails>');

        return <div className={styles.maps}>
            <Maps
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyD1LROGB0tFWgOxT-vFa7a2f-dpJTLEXgs&signed_in=true'
                loadingElement={<div style={{ height: '80%' }} />}
                containerElement={<div className={styles.containerElement} />}
                mapElement={<div style={{ height: '100%' }} />}
                coordinates={marker}
                houses={houses}
                mapStyles={mapStyles}
                setMarker={setMarker}
            />
        </div>
    }
}

EditeMap.propTypes = {
    marker: PropTypes.object,
    setMarker: PropTypes.func.isRequired,
}