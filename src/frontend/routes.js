import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './common/containers/Layout.jsx';
//containers
import ProjectsList from './modules/projects/containers/ProjectsList.jsx';
import Styles from './modules/styles/containers/Styles.jsx';
import ProjectDetails from './modules/projects/containers/ProjectDetails.jsx';
import MapContainer from './modules/map/containers/Map.jsx';
import PlaceAdd from './modules/map/containers/PlaceAdd.jsx';

export default (/* data */) => {
    return (
        <Route path='/' component={Layout}>
            <Route path='projects'>
                <IndexRoute component={ProjectsList} />
                <Route path=':projectId' component={ProjectDetails} />
            </Route>
            <Route path='map'>
                <IndexRoute component={MapContainer} />
                <Route path='add' component={PlaceAdd} />
                <Route path='edit/:placeId' component={PlaceAdd} />
            </Route>
            <Route path='styles' component={Styles} />
        </Route>
    )
}
