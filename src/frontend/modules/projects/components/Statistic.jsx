import React from 'react';
import PropTypes from 'prop-types';
//Components
import styles from './Statistic.scss';

export default class Statistic extends React.Component {

    render() {
        const { current, plan, fail, className } = this.props;
        console.log('RENDER <Statistic>');

        return <span className={styles.plans + ' ' + className}>
            <span className={styles.row + ' ' + styles.current}>
                Факт: <span className={styles.value}>{current}%</span>
            </span>
            <span className={styles.row + ' ' + styles.plan}>
                План: <span className={styles.value}>{plan}%</span>
            </span>
            <span className={styles.row + ' ' + styles.miss}>
                Откл: <span className={styles.value}>{fail}%</span>
            </span>
        </span>
    }
}

Statistic.propTypes = {
    current: PropTypes.number.isRequired,
    plan: PropTypes.number.isRequired,
    fail: PropTypes.number.isRequired,
    className: PropTypes.string,
}
