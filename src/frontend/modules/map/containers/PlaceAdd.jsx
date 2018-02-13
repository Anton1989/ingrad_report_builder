import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPlaces, addPlace, updatePlace, dismissError } from '../actions/placesActions';
//Components
import Form from '../components/Form.jsx';
import EditeMap from '../components/EditeMap.jsx';

class PlaceAdd extends React.Component {

    constructor() {
        super();

        this.state = {
            marker: null,
            houses: []
        }

        this.setMarker = this.setMarker.bind(this);
        this.setPolygons = this.setPolygons.bind(this);
    }

    componentWillMount() {
        if (this.props.places.data.length == 0) {
            this.props.getPlaces();
        } else if (this.props.params.placeId) {
            let place = this.props.places.data.find(place => place._id == this.props.params.placeId);
            this.setState({ marker: place.coordinates });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.placeId && newProps.places.data.length > 0) {
            let place = newProps.places.data.find(place => place._id == newProps.params.placeId);
            this.setState({ marker: place.coordinates });
        }
    }

    setMarker(coordinates) {
        this.setState({ marker: coordinates });
    }

    setPolygons(houses) {
        this.setState({ houses });
    }

    render() {
        const { places, addPlace, updatePlace, params } = this.props;
        console.log('RENDER <PlaceAdd>');

        let place = null;

        if (params.placeId && places.data.length > 0) {
            place = places.data.find(place => place._id == params.placeId);
        }

        return <div>
            <Form place={place} marker={this.state.marker} addPlace={addPlace} updatePlace={updatePlace} setMarker={this.setMarker} setPolygons={this.setPolygons} />
            <EditeMap marker={this.state.marker} setMarker={this.setMarker} houses={this.state.houses} />
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
        addPlace: bindActionCreators(addPlace, dispatch),
        updatePlace: bindActionCreators(updatePlace, dispatch),
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceAdd);