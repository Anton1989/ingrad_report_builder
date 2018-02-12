import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPlaces, addPlace, dismissError } from '../actions/placesActions';
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
        }
    }

    setMarker(coordinates) {
        this.setState({ marker: coordinates });
    }

    setPolygons(houses) {
        this.setState({ houses });
    }

    render() {
        const { places, addPlace, params } = this.props;
        console.log('RENDER <PlaceAdd>');

        let place = null;

        if (params.placeId && places.data.length > 0) {
            place = places.data.find(place => place._id == params.placeId);
        }

        return <div>
            <Form place={place} marker={this.state.marker} addPlace={addPlace} setMarker={this.setMarker} setPolygons={this.setPolygons} />
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
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceAdd);