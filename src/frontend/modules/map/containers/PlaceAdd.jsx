import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPlaces, addPlace, updatePlace, dismissError, setPlaceCenter, getDetails } from '../actions/placesActions';
import { addPanorame, savePanorame, deletePanaram } from '../actions/panoramsActions';
import { addLayer, saveLayer, deleteLayer, showOnMap } from '../actions/layerActions';
import { addBuild, saveBuild, deleteBuild } from '../actions/buildActions';
import { getStyles } from '../../styles/actions/stylesActions';
//Components
import Form from '../components/Form.jsx';
import EditeMap from '../components/EditeMap.jsx';

class PlaceAdd extends React.Component {

    constructor() {
        super();

        this.state = {
            marker: null,
            layers: [],
            houses: [],
            updateHouse: null
        }

        this.setHouseMarker = this.setHouseMarker.bind(this);
        this.setCameraMarker = this.setCameraMarker.bind(this);
        this.setPolygons = this.setPolygons.bind(this);
        this.setOverlays = this.setOverlays.bind(this);
    }

    componentWillMount() {
        if (this.props.places.data.length == 0) {
            this.props.getPlaces();
        } else if (this.props.params.placeId) {
            let place = this.props.places.data.find(place => place._id == this.props.params.placeId);
            this.setState({ marker: place.coordinates });
        }
        if (this.props.styles.data.length == 0) {
            this.props.getStyles();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.placeId && newProps.places.data.length > 0) {
            let place = newProps.places.data.find(place => place._id == newProps.params.placeId);
            this.setState({ marker: place.coordinates });
        }
    }

    setCameraMarker(coordinates, index) {
        const houses = [ ...this.state.houses ];
        houses[index].coordinates[0] = coordinates;
        this.setState({ updateHouse: { index, coordinates }, houses });
    }

    setHouseMarker(coordinates, index) {
        const houses = [ ...this.state.houses ];
        houses[index].lat = coordinates.lat;
        houses[index].lng = coordinates.lng;
        this.setState({ updateHouse: { index, coordinates }, houses });
    }

    setPolygons(houses) {
        this.setState({ houses });
    }

    setOverlays(layers) {
        this.setState({ layers });
    }

    render() {
        const { places, panarams, saveBuild, addBuild, deleteBuild, showOnMap, layer, build, styles, addLayer, saveLayer, deleteLayer, addPlace, updatePlace, params, setPlaceCenter, getDetails, addPanorame, savePanorame, deletePanaram } = this.props;
        console.log('RENDER <PlaceAdd>', build);

        let place = null;
        let panaramsF = [];
        let layers = [];
        let builds = [];
        if (params.placeId && places.data.length > 0) {
            place = places.data.find(place => place._id == params.placeId);
            panaramsF = panarams.data[place._id];
            layers = layer.data[place._id];
            builds = build.data[place._id];
        }

        return <div>
            <EditeMap
                place={place}
                setPlaceCenter={setPlaceCenter}
                layers={layers}
                toShowLayers={layer.toShow}
                setCameraMarker={this.setCameraMarker}
                setHouseMarker={this.setHouseMarker}
                marker={this.state.marker}
                mapStyles={styles.data}
                houses={builds}
            />
            <Form 
                setPlaceCenter={setPlaceCenter} 
                panarams={panaramsF}
                layers={layers}
                builds={builds}
                toShowLayers={layer.toShow}
                showOnMap={showOnMap}
                getDetails={getDetails} 
                addLayer={addLayer}
                saveLayer={saveLayer}
                saveBuild={saveBuild}
                addBuild={addBuild}
                deleteBuild={deleteBuild}
                deleteLayer={deleteLayer}
                detailFetching={panarams.fetching} 
                fetching={places.fetching} 
                setOverlays={this.setOverlays} 
                place={place} mapStyles={styles.data} 
                updateHouse={this.state.updateHouse}
                marker={this.state.marker}
                addPlace={addPlace} 
                addPanorame={addPanorame}
                deletePanaram={deletePanaram}
                savePanorame={savePanorame}
                updatePlace={updatePlace} 
                setPolygons={this.setPolygons} 
            />
        </div>;
    }
}
function mapStateToProps(state) {
    return {
        places: state.places,
        panarams: state.panarams,
        layer: state.layer,
        build: state.build,
        styles: state.styles
    }
}
function mapDispatchToProps(dispatch) {
    return {
        showOnMap: bindActionCreators(showOnMap, dispatch), 
        getDetails: bindActionCreators(getDetails, dispatch), 
        getStyles: bindActionCreators(getStyles, dispatch),
        addLayer: bindActionCreators(addLayer, dispatch),
        saveLayer: bindActionCreators(saveLayer, dispatch),
        addBuild: bindActionCreators(addBuild, dispatch),
        saveBuild: bindActionCreators(saveBuild, dispatch),
        deleteBuild: bindActionCreators(deleteBuild, dispatch),
        deleteLayer: bindActionCreators(deleteLayer, dispatch),
        addPanorame: bindActionCreators(addPanorame, dispatch),
        savePanorame: bindActionCreators(savePanorame, dispatch),
        deletePanaram: bindActionCreators(deletePanaram, dispatch),
        addPlace: bindActionCreators(addPlace, dispatch),
        updatePlace: bindActionCreators(updatePlace, dispatch),
        getPlaces: bindActionCreators(getPlaces, dispatch),
        setPlaceCenter: bindActionCreators(setPlaceCenter, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceAdd);