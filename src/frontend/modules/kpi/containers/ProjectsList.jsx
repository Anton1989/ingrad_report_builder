import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { get, post, dismissError } from '../actions/kpiActions';
//Components
import ProjectsTable from '../components/ProjectsTable.jsx';
import ToolBar from '../components/ToolBar.jsx';

//import styles from './ProjectsList.scss';

class ProjectsList extends React.Component {

    componentDidMount() {
        if (this.props.kpi.data.length == 0) this.props.get(this.props.location.query.role);
    }

    render() {
        const { kpi, post, dismissError } = this.props;
        console.log('RENDER <ProjectsList>');

        return <div>
            <ToolBar create={post} />
            <ProjectsTable projects={kpi} dismissError={dismissError} />
        </div>
    }
}
function mapStateToProps(state) {
    return {
        kpi: state.kpi
    }
}
function mapDispatchToProps(dispatch) {
    return {
        get: bindActionCreators(get, dispatch),
        post: bindActionCreators(post, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsList);