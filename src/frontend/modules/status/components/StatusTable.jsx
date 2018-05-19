import React from 'react';
// import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert';
import DataCell from './DataCell.jsx';
import Details from './Details.jsx';
import styles from './StatusTable.scss';

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
            openProjects: [],
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

        let head = {};

        projects.data.forEach(project => {
            project.tasks.forEach(task => {
                let name = (!task.kt || task.kt.replace(/\s/g, '') == '') ? task.name : task.kt;

                if (!head[name]) {
                    head[name] = { ...task };
                    head[name].subTasks = {};
                }

                if (task.haveChildren) {
                    task.subTasks.forEach(subTask => {
                        let subName = (!subTask.kt || subTask.kt.replace(/\s/g, '') == '') ? subTask.name : subTask.kt;
                        if (!head[name].subTasks[subName]) {
                            head[name].subTasks[subName] = { ...subTask };
                        }
                    });
                }
            });
        });

        this.setState({ head });
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

    getStatus(procent) {
        if (procent == 0) {
            return 'IN PLAN';
        } else if (procent < 100) {
            return 'IN PROGRESS';
        } else {
            return 'DONE';
        }
    }

    render() {
        const { projects, detailStatus, getDetails } = this.props;
        console.log('RENDER <StatusTable>');

        let classIc = this.state.showNames ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right';

        let bigProj = null;
        projects.data.forEach(project => {
            if (bigProj == null || project.tasks.length > bigProj.tasks.length) {
                bigProj = project;
            }
        });

        return <div className={'col-sm-12 col-md-12 ' + styles.main}>
            {
                projects.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {projects.errors}
                    </Alert>
                </div>
            }
            <div className='table-responsive'>
                {bigProj && <table className='table'>
                    <thead>
                        <tr className={styles.head1}>
                            <th className={styles.paddingRight} colSpan={this.state.showNames ? '3' : '2'}>
                                <p className={styles.prjsHead}>
                                Проекты&nbsp;<span className={'glyphicon ' + classIc + ' ' + styles.button + ' ' + styles.hideNameIco} onClick={this.showNames}></span>
                                </p>
                            </th>
                            <th className={styles.headStatus} colSpan={this.getStepsCount(bigProj.tasks) - 1}>
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
                            {Object.entries(this.state.head).map(val => {
                                return <th className={styles.mainSteps + ' ' + styles.leftBorder} key={val[0]} colSpan={val[1].subTasks ? Object.keys(val[1].subTasks).length : 1}>
                                    {val[0]}
                                </th>;
                            })}
                        </tr>
                        <tr>
                            {Object.entries(this.state.head).map((val, ind) => {
                                if (val[1].haveChildren) {
                                    return Object.entries(val[1].subTasks).map((subStep, i) => {
                                        return <th className={styles.subSteps + ' ' + styles.leftBorder} key={val[1].name + subStep.name + i}>
                                            {subStep[0]}
                                        </th>;
                                    })
                                }
                                return <th className={styles.subSteps + ' ' + styles.leftBorder} key={val[1]['name'] + ind + '_sub'}>
                                    {val[0]}
                                </th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={this.getStepsCount(bigProj.tasks) + 3}></td>
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
                                    let hasDetails = this.state.openProjects.includes(project._id);
                                    let details = detailStatus.data.filter(detail => detail.project_id == project._id);

                                    return <React.Fragment key={project._id}>
                                        <tr>
                                            <td className={styles.number}>
                                                {ind < 10 ? '0' + ind : ind}
                                            </td>
                                            <td className={styles.icon + ' ' + styles.bordRight10} onClick={() => { this.handleShowBuilds(project._id); }}>
                                                <img src={project.logo ? project.logo : '/images/noimage.png'} />
                                            </td>
                                            {this.state.showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight} onClick={() => { this.handleShowBuilds(project._id); }}>
                                                <p className={styles.nameProj}>{project.name}</p>
                                                <p className={styles.addressProj}></p>
                                            </td>}

                                            {Object.entries(this.state.head).map((head, i) => {
                                                let task = project.tasks.find(task => task.kt == head[0] || task.name == head[0]);
                                                
                                                if (!task) {
                                                    return <td key={'NONE' + i} className={STATUSES['NONE']} colSpan={Object.entries(head[1].subTasks).length}>
                                                        <span className='glyphicon glyphicon-ban-circle'></span>
                                                    </td>
                                                } else {
                                                    if (task.haveChildren) {
                                                        return Object.entries(head[1].subTasks).map((subHead, j) => {
                                                            let subTask = task.subTasks.find(task => task.kt == subHead[0] || task.name == subHead[0]);
                                                            if (!subTask) {
                                                                return <td key={'NONE' + j} className={STATUSES['NONE']}>
                                                                    <span className='glyphicon glyphicon-ban-circle'></span>
                                                                </td>
                                                            }
                                                            return <td key={'TD' + subHead[0]} title={subHead[0]} className={STATUSES[this.getStatus(subTask.percentComplete)]}>
                                                                <DataCell step={subTask} uni={i + '-' + j} header={subTask.name} loc_icon={icon} project={project} />
                                                            </td>
                                                        });
                                                    } else {
                                                        return <td key={'TD' + head[0]} title={head[0]} className={STATUSES[this.getStatus(task.percentComplete)]}>
                                                            <DataCell step={task} uni={i + '-' + '_sub'} header={task.name} loc_icon={icon} project={project} />
                                                        </td>
                                                    }
                                                }
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