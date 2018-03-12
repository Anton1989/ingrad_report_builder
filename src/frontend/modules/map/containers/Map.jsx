import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
//Actions
import { getPlaces, dismissError } from '../actions/placesActions';
import { getStyles } from '../../styles/actions/stylesActions';
//Components
import PlaceDetails from '../components/PlaceDetails.jsx';
import styles from '../components/Map.scss';

class Map extends React.Component {

    componentDidMount() {
        if (this.props.places.data.length == 0) {
            this.props.getPlaces();
        }
    }

    editPlace(id) {
        browserHistory.push('/edit/' + id);
    }

    render() {
        const { places, placeId } = this.props;
        console.log('RENDER <Map>');

        let detailStyle = placeId && places.data.length > 0 ? styles.detail : '';
        return <div className={detailStyle}>
            <h1>Редактирование объектов на карте</h1>
            <Link to={'/add'} className='btn btn-default'><span className='glyphicon glyphicon-plus-sign'></span> Добавить</Link>
            <div className='table-responsive'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Адрес</th>
                        <th>Домов</th>
                    </tr>
                </thead>
                <tbody>
                    {places.data.length > 0 && places.data.map(place => {
                        return <tr key={'key_' + place._id} className={styles.row} onClick={() => { this.editPlace(place._id) }}>
                            <td>{place._id}</td>
                            <td>{place.name}</td>
                            <td>{place.address}</td>
                            <td>{place.houses.length}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            </div>
            {placeId && places.data.length > 0 && <PlaceDetails place={places.data.find(place => place._id == placeId)} />}
            {this.props.children}
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
        getStyles: bindActionCreators(getStyles, dispatch),
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);