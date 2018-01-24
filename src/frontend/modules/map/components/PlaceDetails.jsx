import React from 'react';
import PropTypes from 'prop-types';
import styles from './PlaceDetails.scss';

export default class PlaceDetails extends React.Component {

    render() {
        const { place } = this.props;
        console.log('RENDER <PlaceDetails>');
        
        return <div className={'col-sm-4 col-md-3 sidebar ' + styles.details}>
                <div className={'row'}>
                    <img src={place.image} />
                    <h1>{place.name}</h1>
                    <p>
                        <span className={styles.label}>описание</span>
                        <span className={styles.value}>{place.description}</span>
                    </p>
                </div>
        </div>
    }
}

PlaceDetails.propTypes = {
    place: PropTypes.object.isRequired
}