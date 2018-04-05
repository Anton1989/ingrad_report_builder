import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './common/containers/Layout.jsx';
//containers
import Styles from './modules/styles/containers/Styles.jsx';
import MapContainer from './modules/map/containers/Map.jsx';
import PlaceAdd from './modules/map/containers/PlaceAdd.jsx';
import Pd from './modules/pd/containers/Pd.jsx';
import ProjectsList from './modules/kpi/containers/ProjectsList.jsx';
import ProjectKpi from './modules/kpi/containers/ProjectKpi.jsx';

export default (/* data */) => {
    return (
        <Route path='/' component={Layout}>
            <IndexRoute component={MapContainer} />
            <Route path='add' component={PlaceAdd} />
            <Route path='edit/:placeId' component={PlaceAdd} />
            <Route path='styles' component={Styles} />
            <Route path='pd' component={Pd} />
            <Route path='kpi'>
                <IndexRoute component={ProjectsList} />
                <Route path=':projectId' component={ProjectKpi} />
            </Route>
        </Route>
    )
}
