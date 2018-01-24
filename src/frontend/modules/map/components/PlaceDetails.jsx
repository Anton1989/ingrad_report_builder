import React from 'react';
import PropTypes from 'prop-types';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import styles from './PlaceDetails.scss';

const labels = {
    description: 'описание',
    step: 'стадия проекта',
    site: 'коммерческий сайт',
    camera: 'web-камера',
    photo: 'фото',
    address: 'адрес'
};

export default class PlaceDetails extends React.Component {

    close() {
        browserHistory.push('/map');
    }

    render() {
        const { place } = this.props;
        console.log('RENDER <PlaceDetails>');
        
        return <div className={'col-sm-4 col-md-3 sidebar ' + styles.details}>
            <a className={styles.close} onClick={this.close} ><span className={'glyphicon glyphicon-remove'}></span></a>
            <div className={'row'}>
                <div style={{backgroundImage: 'url("' + place.image + '")'}} className={styles.image}></div>
                <h1>{place.name}</h1>
                {Object.keys(place).map(field => {
                    if (labels[field]) {
                        return <p key={field}>
                            <span className={styles.label}>{labels[field]}</span>
                            <span className={styles.value}>{place[field]}</span>
                        </p>;
                    }
                })}
                <p>
                    <Link to='/map'><span className={'glyphicon glyphicon-chevron-left'}></span> назад</Link>
                </p>
            </div>
        </div>
    }
}

PlaceDetails.propTypes = {
    place: PropTypes.object.isRequired
}