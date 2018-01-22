import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getProjects, dismissError } from '../actions/projectActions';
//Components
import List from '../components/List.jsx';

class ProjectsList extends React.Component {

    componentDidMount() {
        if (this.props.projects.data.length == 0) this.props.getProjects();
    }
    
    render() {
        const { projects, dismissError } = this.props;
        console.log('RENDER <Projects>');

        return <List projects={projects} dismissError={dismissError} />
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
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsList);