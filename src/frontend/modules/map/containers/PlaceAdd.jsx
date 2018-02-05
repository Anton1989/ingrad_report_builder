import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
//Components
import styles from './PlaceAdd.scss';

class PlaceAdd extends React.Component {

    render() {
        // const { places, type, activeTypes, placeId, openPlace } = this.props;
        console.log('RENDER <PlaceAdd>');

        return <div className={'col-sm-4 col-md-3 sidebar ' + styles.add}>
            <div className='row'>
                <h1>Добавить новый проект</h1>
                <form>
                    <div className='col-sm-12 col-md-12'>
                        <div className='form-group'>
                            <label htmlFor='name'>Название</label>
                            <input type='text' className='form-control' id='name' placeholder='Название' />
                        </div>
                    </div>
                </form>
            </div>
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
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceAdd);