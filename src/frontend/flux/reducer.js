import { combineReducers } from 'redux';
import status from '../modules/status/reducers/status';
import projects from '../modules/status/reducers/projects';

export default combineReducers({
    status,
    projects
});