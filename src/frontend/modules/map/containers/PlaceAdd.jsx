import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPlaces, addPlace, updatePlace, dismissError } from '../actions/placesActions';
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

        this.setMarker = this.setMarker.bind(this);
        this.setHouseMarker = this.setHouseMarker.bind(this);
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

    setHouseMarker(coordinates, index) {
        const houses = [ ...this.state.houses ];
        houses[index].lat = coordinates.lat;
        houses[index].lng = coordinates.lng;
        this.setState({ updateHouse: { index, coordinates }, houses });
    }

    setMarker(coordinates) {
        this.setState({ marker: coordinates });
    }

    setPolygons(houses) {
        this.setState({ houses });
    }

    setOverlays(layers) {
        this.setState({ layers });
    }

    render() {
        const { places, styles, addPlace, updatePlace, params } = this.props;
        console.log('RENDER <PlaceAdd>');

        let place = null;

        if (params.placeId && places.data.length > 0) {
            place = places.data.find(place => place._id == params.placeId);
        }

        return <div>
            <EditeMap layers={this.state.layers} setHouseMarker={this.setHouseMarker} marker={this.state.marker} mapStyles={styles.data} setMarker={this.setMarker} houses={this.state.houses} />
            <Form setOverlays={this.setOverlays} place={place} mapStyles={styles.data} updateHouse={this.state.updateHouse} marker={this.state.marker} addPlace={addPlace} updatePlace={updatePlace} setMarker={this.setMarker} setPolygons={this.setPolygons} />
        </div>;
    }
}
function mapStateToProps(state) {
    return {
        places: state.places,
        styles: state.styles
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getStyles: bindActionCreators(getStyles, dispatch),
        addPlace: bindActionCreators(addPlace, dispatch),
        updatePlace: bindActionCreators(updatePlace, dispatch),
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceAdd);