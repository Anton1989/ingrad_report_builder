import React from 'react';
// import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert';
import DataCell from './DataCell.jsx';
import Details from './Details.jsx';
import styles from './StatusTable.scss';

const STATUSES = {
    'IN PLAN': styles.inPlan,
    'IN PROGRESS': styles.inProgress,
    'DONE': styles.done
}

export default class StatusTable extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            openProjects: [],
            locations: [],
            showNames: true
        }

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleShowBuilds = this.handleShowBuilds.bind(this);
        this.showNames = this.showNames.bind(this);
    }

    componentWillMount() {
        this.sortProjects();
    }

    componentWillReceiveProps(newProps) {
        this.sortProjects(newProps);
    }

    sortProjects(props = this.props) {
        let locations = [];
        props.projects.data.forEach(project => {
            if (!locations.includes(project.location)) {
                locations.push(project.location);
            }
        });
        this.setState({ locations });
    }

    getStepsCount(status) {
        let count = 0;
        status.data[0].steps.forEach(step => {
            count += step.subSteps.length;
        });
        return count;
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    handleShowBuilds(id) {
        const openProjects = [...this.state.openProjects];
        const index = openProjects.indexOf(id);
        if (index !== -1) {
            openProjects.splice(index, 1);
        } else {
            openProjects.push(id);
        }
        this.setState({ openProjects });
    }

    showNames() {
        this.setState({ showNames: !this.state.showNames });
    }

    render() {
        const { projects, status, detailStatus, getDetails } = this.props;
        console.log('RENDER <StatusTable>');

        let classIc = this.state.showNames ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right';

        return <div className={'col-sm-11 col-md-11 ' + styles.main}>
            {
                projects.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {projects.errors}
                    </Alert>
                </div>
            }
            <div className='table-responsive'>
                {status.data.length > 0 && <table className='table'>
                    <thead>
                        <tr className={styles.head1}>
                            <th className={styles.paddingRight} colSpan={this.state.showNames ? '3' : '2'}>
                                Проекты&nbsp;<span className={'glyphicon ' + classIc + ' ' + styles.button + ' ' + styles.hideNameIco} onClick={this.showNames}></span>
                            </th>
                            <th className={styles.headStatus} colSpan={this.getStepsCount(status) - 1}>
                                Статус
                            </th>
                            <th className={styles.closeStatus}>
                                <span className={'glyphicon glyphicon-remove ' + styles.button}></span>
                            </th>
                        </tr>
                        <tr>
                            <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.bordRight10} rowSpan='2' colSpan='2'>
                                №
                            </th>
                            {this.state.showNames && <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.paddingRight} rowSpan='2'>
                                Наименование
                            </th>}
                            {status.data[0].steps.map(step => {
                                return <th className={styles.mainSteps + ' ' + styles.leftBorder} key={step['name']} colSpan={step.subSteps.length}>
                                    {step.name}
                                </th>;
                            })}
                        </tr>
                        <tr>
                            {status.data[0].steps.map(step => {
                                return step.subSteps.map((subStep, i) => {
                                    return <th className={styles.subSteps + ' ' + styles.leftBorder} key={step['name'] + subStep['name'] + i}>
                                        {subStep.name}
                                    </th>;
                                });
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={status.data[0].steps[0].subSteps.length * status.data[0].steps.length + 3}></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className={styles.icon + ' ' + styles.bordRight10}>
                                <img src='/images/all.jpg' />
                            </td>
                            {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>Все проекты</td>}
                        </tr>

                        {this.state.locations.map(location => {
                            let icon = '/images/outmsk.png';
                            if (location == 'Москва') {
                                icon = '/images/msk.png';
                            }
                            let filteredProjects = projects.data.filter(project => project.location == location);

                            return [
                                <tr>
                                    <td></td>
                                    <td className={styles.icon + ' ' + styles.bordRight10}>
                                        <img src={icon} />
                                    </td>
                                    {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>{location}</td>}
                                </tr>,
                                filteredProjects.map((project, i) => {
                                    let projectStatuse = status.data.find(item => item.project_id == project._id);
                                    const ind = i + 1;
                                    let hasDetails = this.state.openProjects.includes(project._id);
                                    let details = detailStatus.data.filter(detail => detail.project_id == project._id);

                                    return <React.Fragment>
                                        <tr>
                                            <td className={styles.number}>
                                                {ind < 10 ? '0' + ind : ind}
                                            </td>
                                            <td className={styles.icon + ' ' + styles.bordRight10} onClick={() => { this.handleShowBuilds(project._id); }}>
                                                <img src={project.logo} />
                                            </td>
                                            {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight} onClick={() => { this.handleShowBuilds(project._id); }}>
                                                <p className={styles.nameProj}>{project.name}</p>
                                                <p className={styles.addressProj}>{project.address}</p>
                                            </td>}

                                            {projectStatuse.steps.map((mainStep, i) => {
                                                return mainStep.subSteps.map((subStep, j) => {
                                                    return <td className={STATUSES[subStep.status]}>
                                                        <DataCell step={subStep} uni={i + '-' + j} header={subStep.name} loc_icon={icon} project={project} />
                                                    </td>
                                                });
                                            })}
                                        </tr>
                                        {hasDetails && <Details details={details} showNames={this.state.showNames} fetching={detailStatus.fetching} getDetails={getDetails} id={project._id} />}
                                    </React.Fragment>;
                                })
                            ]
                        })}

                    </tbody>
                </table>}
            </div>
        </div>;
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }