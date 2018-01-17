import React from 'react';
import PropTypes from 'prop-types';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
import layoutCss from './../../../common/containers/Layout.scss';
import styles from './Details.scss';
import Header from './Header.jsx';
import ReinforcedConcreteWorks from './ReinforcedConcreteWorks.jsx';
import Link from 'react-router/lib/Link';

export default class Details extends React.Component {

    constructor(...props) {
        super(...props);

        this._handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    render() {
        const { project, projects } = this.props;
        console.log('RENDER <Details>');

        return <div className={styles.detailPage}>
            <div className={layoutCss.bc}><Link to='/projects'>Проекты</Link> / {project ? project.comercialName : '...'}</div>
            {
                projects.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {projects.errors}
                    </Alert>
                </div>
            }
            {projects.fetching && projects.data.length == 0 && <Loading />}
            {project && <Header project={project} />}

            <h2 className={styles.titleJob}>
                1. Общестроительные работы 
                <span className={styles.plans}>
                    <span className={styles.row + ' ' + styles.current}>
                        Факт: <span className={styles.value}>36%</span>
                    </span>
                    <span className={styles.row + ' ' + styles.plan}>
                        План: <span className={styles.value}>44%</span>
                    </span>
                    <span className={styles.row + ' ' + styles.miss}>
                        Откл: <span className={styles.value}>-8%</span>
                    </span>
                </span>
            </h2>
            <h3 className={styles.titleSubJob}>
                1.1. Ж/б конструкции
                <span className={styles.plans}>
                    <span className={styles.row + ' ' + styles.current}>
                        Факт: <span className={styles.value}>59%</span>
                    </span>
                    <span className={styles.row + ' ' + styles.plan}>
                        План: <span className={styles.value}>80%</span>
                    </span>
                    <span className={styles.row + ' ' + styles.miss}>
                        Откл: <span className={styles.value}>-21%</span>
                    </span>
                </span>
            </h3>
            {project && <ReinforcedConcreteWorks project={project} />}
        </div>
    }
}
Details.propTypes = {
    projects: PropTypes.object.isRequired,
    project: PropTypes.object,
    dismissError: PropTypes.func.isRequired
}