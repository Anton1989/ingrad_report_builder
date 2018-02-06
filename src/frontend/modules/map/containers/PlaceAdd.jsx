import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
//Components
import Form from '../components/Form.jsx';

class PlaceAdd extends React.Component {

    render() {
        // const { places, type, activeTypes, placeId, openPlace } = this.props;
        console.log('RENDER <PlaceAdd>');

        return <Form />;
    }
}
function mapStateToProps(state) {
    return {
        places: state.places
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceAdd);