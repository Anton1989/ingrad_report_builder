import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './common/containers/Layout.jsx';
//containers
import Docs from './modules/docs/containers/Docs.jsx';
import Add from './modules/docs/containers/Add.jsx';

export default (/* data */) => {
    return (
        <Route path='/' component={Layout}>
            <IndexRoute component={Docs} />
            <Route path='/add' component={Add} />
            <Route path='/edit/:id' component={Add} />
        </Route>
    )
}
