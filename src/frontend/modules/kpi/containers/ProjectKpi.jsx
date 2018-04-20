import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { get, put, dismissError } from '../actions/kpiActions';
import { getStyles } from '../../styles/actions/stylesActions';
//Components
import KpiTable from '../components/KpiTable.jsx';

//import styles from './ProjectsList.scss';

class ProjectKpi extends React.Component {

    constructor() {
        super();

        this.state = {
            project: null
        };

        // this.upload = this.upload.bind(this);
    }

    componentDidMount() {
        if (this.props.kpi.data.length == 0) this.props.get();
        if (this.props.styles.kpiData.length == 0) this.props.getStyles('kpi');
    }

    componentWillMount() {
        this.setState({ project: this.findProject() });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ project: this.findProject(newProps) });
    }

    findProject(props = this.props) {
        // console.log(this.props.params.projectId, this.props.kpi.data)
        if (props.kpi.data.length == 0) return null;
        return props.kpi.data.find((project) => project._id == this.props.params.projectId);
    }

    render() {
        const { kpi, styles, put, dismissError } = this.props;
        console.log('RENDER <ProjectKpi>');

        return <KpiTable project={this.state.project} kpiStyles={styles.kpiData} fetching={kpi.fetching} errors={kpi.errors} save={put} dismissError={dismissError} />;
    }
}
function mapStateToProps(state) {
    return {
        styles: state.styles,
        kpi: state.kpi
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getStyles: bindActionCreators(getStyles, dispatch),
        get: bindActionCreators(get, dispatch),
        put: bindActionCreators(put, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectKpi);