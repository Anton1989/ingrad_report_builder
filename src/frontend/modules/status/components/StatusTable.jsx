import React from 'react';
// import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert';
import DataCell from './DataCell.jsx';
import Details from './Details.jsx';
import styles from './StatusTable.scss';
import config from '../../../config';

const STATUSES = {
    'IN PLAN': styles.inPlan,
    'IN PROGRESS': styles.inProgress,
    'DONE': styles.done,
    'NONE': styles.none
}
const LOCATION = {
    'm': 'Москва',
    'mo': 'Московская область'
}

export default class StatusTable extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            openProjects: [ '00-000022' ],
            locations: [],
            head: {},
            showNames: true
        }

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleShowBuilds = this.handleShowBuilds.bind(this);
        this.showNames = this.showNames.bind(this);
    }

    componentWillMount() {
        this.sortProjects();
        this.generateHead();
    }

    componentWillReceiveProps(newProps) {
        this.sortProjects(newProps);
        this.generateHead(newProps);
    }

    generateHead(props = this.props) {
        const { projects } = props;
        const head = {};

        this.getKtChildes(head, projects.data);
        this.setState({ head });
    }

    getKtChildes(head, projects) {
        const projectsFiltered = projects.filter(project => this.state.openProjects.includes(project.parent));
        projectsFiltered.forEach(project => {
            if (project.tasks && project.tasks.length > 0) {
                this.getKtStatus(head, project.tasks);
            }
            if (project.childes && project.childes.length > 0) {
                this.getKtChildes(head, project.childes);
            }
        });
    }

    getKtStatus(head, statuses) {
        statuses.forEach(status => {
            if (!head[status.kt] && status.kt.trim() !== '') {
                const status2kt = Object.entries(config.defaultVars.kt).find(item => item[1].kts.includes(status.kt.trim()));
                if (status2kt) {
                    head[status2kt[0]] = status2kt[1];
                }
                
            }
        });
    }

    sortProjects(props = this.props) {
        let locations = [];
        props.projects.data.forEach(project => {
            if (!locations.includes(project.location)) {
                locations.push(project.location);
            }
        });
        locations.sort();
        this.setState({ locations });
    }

    getStepsCount(tasks) {
        let count = 0;
        tasks.forEach(step => {
            if (step.haveChildren) {
                count += step.subTasks.length;
            } else {
                count++;
            }
        });
        return count;
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    handleShowBuilds(projectId, code) {
        const openProjects = [...this.state.openProjects];
        const index = openProjects.indexOf(code);
        if (index !== -1) {
            openProjects.splice(index, 1);
        } else {
            openProjects.push(code);
        }
        this.setState({ openProjects });
        const buildings = this.props.projects.data.filter(sub => code == sub.parent);
        if (buildings.length == 0) {
            this.props.getProjects(projectId, code);
        }
    }

    showNames() {
        this.setState({ showNames: !this.state.showNames });
    }

    getStatus(task) {
        if (task.percentComplete > 0 && !task.actualStart) {
            if (task.percentComplete < 100) {
                return 'IN PROGRESS';
            } else {
                return 'DONE';
            }
        } else {
            if (task.actualStart == '0001-01-01T00:00:00' || !task.actualStart) {
                return 'IN PLAN';
            } else if (task.actualFinish == '0001-01-01T00:00:00' || !task.actualFinish) {
                return 'IN PROGRESS';
            } else {
                return 'DONE';
            }
        }
    }

    findTask(statuses, kts) {
        if (statuses && statuses.length > 0) {
            return statuses.find(status => kts.includes(status.kt));
        }
        return null;
    }

    render() {
        const { projects } = this.props;
        console.log('RENDER <StatusTable>', this.state.openProjects);

        let classIc = this.state.showNames ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right';

        return <div className={'col-sm-12 col-md-12 ' + styles.main}>
            {
                projects.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {projects.errors}
                    </Alert>
                </div>
            }
            <div className='table-responsive'>
                {projects.data.length > 0 && <table className='table'>
                    <thead>
                        <tr className={styles.head1}>
                            <th className={styles.paddingRight} colSpan={this.state.showNames ? '3' : '2'}>
                                <p className={styles.prjsHead}>
                                Проекты&nbsp;<span className={'glyphicon ' + classIc + ' ' + styles.button + ' ' + styles.hideNameIco} onClick={this.showNames}></span>
                                </p>
                            </th>
                            <th className={styles.headStatus} colSpan={Object.entries(this.state.head).length - 1}>
                                Статус
                            </th>
                            <th className={styles.closeStatus}>
                                <span className={'glyphicon glyphicon-remove ' + styles.button}></span>
                            </th>
                        </tr>
                        <tr>
                            <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.bordRight10} colSpan='2'>
                                №
                            </th>
                            {this.state.showNames && <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.paddingRight}>
                                Наименование
                            </th>}
                            {Object.entries(this.state.head).map(val => {
                                return <th title={val[1].name} className={styles.mainSteps + ' ' + styles.leftBorder} key={val[0]}>
                                    {val[0]}
                                </th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={Object.entries(this.state.head).length + 3}></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className={styles.icon + ' ' + styles.bordRight10}>
                                <img src='/images/all.jpg' />
                            </td>
                            {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>Все проекты</td>}
                        </tr>

                        {this.state.locations.map(location => {
                            if (!location) {
                                return null;
                            }
                            let icon = '/images/outmsk.png';
                            if (location == 'm') {
                                icon = '/images/msk.png';
                            }
                            let filteredProjects = projects.data.filter(project => project.location == location);

                            return [
                                <tr key={location}>
                                    <td></td>
                                    <td className={styles.icon + ' ' + styles.bordRight10}>
                                        <img src={icon} />
                                    </td>
                                    {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>{LOCATION[location]}</td>}
                                </tr>,
                                filteredProjects.map((project, i) => {
                                    const ind = i + 1;
                                    const hasDetails = this.state.openProjects.includes(project.code);

                                    return <React.Fragment key={'ROW' + project._id}>
                                        <tr>
                                            <td className={styles.number}>
                                                {ind < 10 ? '0' + ind : ind}
                                            </td>
                                            <td className={styles.icon + ' ' + styles.bordRight10 + ' ' + styles.cursor} onClick={() => { this.handleShowBuilds(project.projectIntegrationId, project.code); }}>
                                                <img src={project.logo ? project.logo : '/images/noimage.png'} />
                                            </td>
                                            {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>
                                                <p className={styles.plus} onClick={() => { this.handleShowBuilds(project.projectIntegrationId, project.code); }}><span className={'glyphicon ' + (hasDetails ? 'glyphicon-minus' : 'glyphicon-plus')}></span></p>
                                                <p className={styles.nameProj}>{project.name}</p>
                                                <p className={styles.addressProj}></p>
                                            </td>}

                                            {Object.entries(this.state.head).map((head, i) => {
                                                let status = this.findTask(project.tasks, head[1].kts);
                                                
                                                if (!status) {
                                                    return <td key={'NONE' + i} className={STATUSES['NONE']}>
                                                        <span className='glyphicon glyphicon-ban-circle'></span>
                                                    </td>
                                                } else {
                                                    return <td key={'TD' + head[1].name} title={head[1].name} className={STATUSES[this.getStatus(status)]}>
                                                        <DataCell title={project.name} step={status} uni={i + '-' + '_sub'} headerName={head[1].name} headerCode={head[0]} loc_icon={icon} project={project} />
                                                    </td>
                                                }
                                            })}
                                        </tr>
                                        {hasDetails && <Details title={project.name} projects={projects.data} code={project.code} projectId={project.projectIntegrationId} handleShowBuilds={this.handleShowBuilds} openProjects={this.state.openProjects} heads={this.state.head} showNames={this.state.showNames} id={project._id} />}
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