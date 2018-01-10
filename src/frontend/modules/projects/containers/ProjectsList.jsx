import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getProjects, save, dismissError } from '../actions/projectActions';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
import Row from '../components/Row.jsx';

class ProjectsList extends React.Component {
    constructor(...props) {
        super(...props);

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }
    componentDidMount() {
        if (this.props.projects.data.length == 0) this.props.getProjects();
    }
    handleAlertDismiss() {
        this.props.dismissError();
    }
    render() {
        const { projects, save } = this.props;
        console.log('RENDER <Projects>');

        return <div className='table-responsive'>
            {
                projects.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {projects.errors}
                    </Alert>
                </div>
            }
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Department</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {projects.fetching && projects.data.length == 0 && <tr><td colSpan='5'><Loading /></td></tr>}
                    {projects.data.length > 0 && projects.data.map(employee => {
                        return <Row key={employee.id} employee={employee} departments={projects} save={save} />;
                    })}
                </tbody>
            </table>
        </div>
    }
}
function mapStateToProps(state) {
    return {
        projects: state.projects
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getProjects: bindActionCreators(getProjects, dispatch),
        save: bindActionCreators(save, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsList);