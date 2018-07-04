import { combineReducers } from 'redux';
import status from '../modules/status/reducers/status';
import detailStatus from '../modules/status/reducers/detailStatus';
import projects from '../modules/status/reducers/projects';
import docs from '../modules/docs/reducers/docs';

export default combineReducers({
    status,
    detailStatus,
    docs,
    projects
});