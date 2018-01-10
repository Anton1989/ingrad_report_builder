import React from 'react';
import styles from './Loading.scss';

export default class Loading extends React.Component {
    render() {
        return <div id={styles.floatBarsG}>
            <div id={styles.floatBarsG_1} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_2} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_3} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_4} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_5} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_6} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_7} className={styles.floatBarsG}></div>
            <div id={styles.floatBarsG_8} className={styles.floatBarsG}></div>
        </div>
    }
}
