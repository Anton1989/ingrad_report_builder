import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './common/containers/Layout.jsx';
//containers
import ProjectsList from './modules/kpi/containers/ProjectsList.jsx';
import ProjectKpi from './modules/kpi/containers/ProjectKpi.jsx';

export default (/* data */) => {
    return (
        <Route path='/' component={Layout}>
            <IndexRoute component={ProjectsList} />
            <Route path=':projectId' component={ProjectKpi} />
        </Route>
    )
}
