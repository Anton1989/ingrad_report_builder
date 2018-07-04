import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';
//Utiles
import { calculateFloors } from '../../../utiles/match';

export default class Row extends React.Component {
    
    render() {
        const { project } = this.props;
        console.log('RENDER <ProjectRow>');

        let floors = calculateFloors(project.sections);
        
        // let button = <td><span className='glyphicon glyphicon-pencil' onClick={this.switchMode}></span></td>;
        // if(this.state.editable) {
        //     button = <td>
        //         <span className='glyphicon glyphicon-ok' onClick={ () => { this.switchMode(); this.props.save(this.state.employee); } }></span>{' '}
        //         <span className='glyphicon glyphicon-ban-circle' onClick={ () => { this.switchMode(); this.setState({ employee: {...employee} }); } }></span>
        //     </td>;
        // }

        return <tr>
            <th><Link to={CORE_URL + 'projects/' + project._id}>{project.comercialName}</Link></th>
            <th><Link to={CORE_URL + 'projects/' + project._id}>{project.agreementNo}</Link></th>
            <td><Link to={CORE_URL + 'projects/' + project._id}>{project.counterparty}</Link></td>
            <td><Link to={CORE_URL + 'projects/' + project._id}>{project.sections.length}</Link></td>
            <td><Link to={CORE_URL + 'projects/' + project._id}>{floors.min}-{floors.max}</Link></td>
        </tr>;
    }
}
Row.propTypes = {
    project: PropTypes.object.isRequired
}