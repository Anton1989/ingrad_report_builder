import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './common/containers/Layout.jsx';
//containers
import ProjectsList from './modules/projects/containers/ProjectsList.jsx';
import ProjectDetails from './modules/projects/containers/ProjectDetails.jsx';

export default (/* data */) => {
    return (
        <Route path='/' component={Layout}>
            <Route path='projects'>
                <IndexRoute component={ProjectsList} />
                <Route path=':projectId' component={ProjectDetails} />
            </Route>
        </Route>
    )
}
