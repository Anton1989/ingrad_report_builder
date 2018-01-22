import { combineReducers } from 'redux';
import projects from '../modules/projects/reducers/project';
import places from '../modules/map/reducers/place';

export default combineReducers({
    projects,
    places
});