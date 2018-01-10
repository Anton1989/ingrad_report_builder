import React from 'react';
import PropTypes from 'prop-types';

export default class Row extends React.Component {
    constructor(...props) {
        super(...props);

        this.state = {
            editable: false,
            employee: { ...this.props.employee }
        }

        this.switchMode = this.switchMode.bind(this);
        this.changeField = this.changeField.bind(this);
    }
    switchMode() {
        this.setState({editable: !this.state.editable});
    }
    changeField (event) {
        let setting = {};
        setting[event.target.getAttribute('id')] = event.target.value;
        this.setState({ employee: Object.assign(this.state.employee, setting) });
        //this.props.setSettings(this.adfs_id, setting);
    }
    render() {
        const { employee, departments } = this.props;
        console.log('RENDER <EmployeeRow>');

        let firstName = employee.firstName;
        if(this.state.editable) {
            firstName = <input id='firstName' type='text' className='form-control' placeholder='firstName' value={this.state.employee.firstName} onChange={this.changeField} />;
        }
        let lastName = employee.lastName;
        if(this.state.editable) {
            lastName = <input id='lastName' type='text' className='form-control' placeholder='lastName' value={this.state.employee.lastName} onChange={this.changeField} />;
        }

        let department = departments.data.find(department => department.id == employee.departmentId)
        let departmentId = department.name;
        if(this.state.editable) {
            departmentId = <select id='departmentId' className='form-control' value={this.state.employee.departmentId} onChange={this.changeField}>
                {departments.data.map(department => <option key={department.id+'_'+employee.id} value={department.id}>{department.name}</option>)}
            </select>
        }
        
        let button = <td><span className='glyphicon glyphicon-pencil' onClick={this.switchMode}></span></td>;
        if(this.state.editable) {
            button = <td>
                <span className='glyphicon glyphicon-ok' onClick={ () => { this.switchMode(); this.props.save(this.state.employee); } }></span>{' '}
                <span className='glyphicon glyphicon-ban-circle' onClick={ () => { this.switchMode(); this.setState({ employee: {...employee} }); } }></span>
            </td>;
        }

        return <tr>
            <th>{employee.id}</th>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{departmentId}</td>
            {button}
        </tr>;
    }
}
Row.propTypes = {
    employee: PropTypes.object.isRequired,
    departments: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired
}