import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
//Actions
import { getPlaces, delPlace, dismissError } from '../actions/placesActions';
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

    handleDelete(id) {
        this.props.delPlace(id);
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
                        <th>Копировать/Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {places.data.length > 0 && places.data.map(place => {
                        return <tr key={'key_' + place._id} className={styles.row}>
                            <td onClick={() => { this.editPlace(place._id) }}>{place._id}</td>
                            <td onClick={() => { this.editPlace(place._id) }}>{place.name}</td>
                            <td onClick={() => { this.editPlace(place._id) }}>{place.address}</td>
                            <td onClick={() => { this.editPlace(place._id) }}>{place.houses.length}</td>
                            <td>
                                <button type='button' className='btn btn-info'>
                                    <CopyToClipboard text={'http://' + ENV_HOST + '/' + place._id}>
                                        <span className='glyphicon glyphicon-copy'></span>
                                    </CopyToClipboard>
                                </button>&nbsp;
                                <button type='button' className='btn btn-danger' onClick={() => {this.handleDelete(place._id);}}><span className='glyphicon glyphicon-remove'></span></button>
                            </td>
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
        delPlace: bindActionCreators(delPlace, dispatch),
        getStyles: bindActionCreators(getStyles, dispatch),
        getPlaces: bindActionCreators(getPlaces, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);