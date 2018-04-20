import React from 'react';
import PropTypes from 'prop-types';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
import Row from '../components/Row.jsx';

export default class ProjectsTable extends React.Component {

    constructor(...props) {
        super(...props);

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }
    
    render() {
        const { projects } = this.props;
        console.log('RENDER <ProjectsTable>');

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
                        <th>Название</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.fetching && projects.data.length == 0 && <tr><td colSpan='5'><Loading /></td></tr>}
                    {projects.data.length > 0 && projects.data.map(project => {
                        return <Row key={project._id} project={project} />;
                    })}
                </tbody>
            </table>
        </div>
    }
}
ProjectsTable.propTypes = {
    projects: PropTypes.object.isRequired,
    dismissError: PropTypes.func.isRequired
}