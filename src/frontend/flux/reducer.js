import { combineReducers } from 'redux';
import projects from '../modules/projects/reducers/project';
import places from '../modules/map/reducers/place';
import styles from '../modules/styles/reducers/styles';

export default combineReducers({
    projects,
    places,
    styles
});