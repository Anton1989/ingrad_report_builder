import { combineReducers } from 'redux';
import projects from '../modules/projects/reducers/project';
import places from '../modules/map/reducers/place';
import styles from '../modules/styles/reducers/styles';
import pd from '../modules/pd/reducers/pd';

export default combineReducers({
    projects,
    places,
    styles,
    pd
});