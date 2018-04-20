import { combineReducers } from 'redux';
import kpi from '../modules/kpi/reducers/kpi';
import styles from '../modules/styles/reducers/styles';

export default combineReducers({
    styles,
    kpi
});