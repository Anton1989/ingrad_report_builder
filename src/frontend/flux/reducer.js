import { combineReducers } from 'redux';
import projects from '../modules/projects/reducers/project';
import places from '../modules/map/reducers/place';
import styles from '../modules/styles/reducers/styles';
import pd from '../modules/pd/reducers/pd';
import kpi from '../modules/kpi/reducers/kpi';
import panarams from '../modules/map/reducers/panarams';
import layer from '../modules/map/reducers/layer';
import build from '../modules/map/reducers/build';

export default combineReducers({
    projects,
    places,
    styles,
    pd,
    kpi,
    panarams,
    layer,
    build
});