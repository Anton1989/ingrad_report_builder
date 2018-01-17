import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getProjects, dismissError } from '../actions/projectActions';
//Components
import Details from '../components/Details.jsx';

class ProjectDetails extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            project: this._findProject()
        };
    }

    componentDidMount() {
        if (this.props.projects.data.length == 0) this.props.getProjects();
    }

    componentWillReceiveProps(newProps) {
        let project = this._findProject(newProps);
        this.setState({ project });
    }

    _findProject(props = this.props) {
        const { projects, params: { projectId } } = props;

        return projects.data.length > 0 ? projects.data.find(project => project._id == projectId) : null;
    }

    render() {
        const { projects } = this.props;
        console.log('RENDER <ProjectDetails>');

        return <Details projects={projects} project={this.state.project} dismissError={dismissError} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);