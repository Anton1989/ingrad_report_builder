import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';

export default class Row extends React.Component {
    
    render() {
        const { project } = this.props;
        console.log('RENDER <ProjectRow>');

        return <tr>
            <th><Link to={'/kpi/' + project._id}>{project._id}</Link></th>
            <th><Link to={'/kpi/' + project._id}>{project.name}</Link></th>
            <th><Link to={'/kpi/' + project._id}>{project.created_at}</Link></th>
        </tr>;
    }
}
Row.propTypes = {
    project: PropTypes.object.isRequired
}