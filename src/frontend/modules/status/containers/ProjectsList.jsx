import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { get, dismissError } from '../actions/statusActions';
//Components
// import ProjectsTable from '../components/ProjectsTable.jsx';
import StatusTable from '../components/StatusTable.jsx';
import Loading from '../../../common/components/Loading.jsx';
//import styles from './ProjectsList.scss';

class ProjectsList extends React.Component {

    componentDidMount() {
        if (this.props.projects.data.length == 0) this.props.get();
    }

    render() {
        const { projects, status, dismissError } = this.props;
        console.log('RENDER <ProjectsList>');

        return <div className='row'>
            {projects.fetching && projects.data.length == 0 && <Loading />}
            <StatusTable projects={projects} status={status} dismissError={dismissError} />
        </div>
    }
}
function mapStateToProps(state) {
    return {
        projects: state.projects,
        status: state.status
    }
}
function mapDispatchToProps(dispatch) {
    return {
        get: bindActionCreators(get, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsList);