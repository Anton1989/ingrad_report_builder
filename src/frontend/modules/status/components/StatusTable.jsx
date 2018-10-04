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

    componentDidMount() {
        this.tableContainer = this.refs.tableContainer;
        // this.fixDatePickerTopOffset();
        // this.fixTableBodyTopOffset();

        console.log(this.tableContainer)
        if (this.tableContainer) {
            this.tableContainer.addEventListener('scroll', () => {
                // this.fixDatePickerLeftOffset();
                console.log(this.tableContainer.scrollTop)
                this.refs.tableHead.style.top = '' + this.tableContainer.scrollTop + 'px';
            });
        }
    }

    componentDidUpdate() {
        // this.fixDatePickerTopOffset();
        // this.fixDatePickerLeftOffset();
        // this.fixTableBodyTopOffset();
    }

    componentWillReceiveProps(newProps) {
        this.sortProjects(newProps);
        // this.generateHead(newProps);
    }

    generateHead() {
        // const { projects } = props;
        // const head = {};

        // this.getKtChildes(head, projects.data);
        // const sortedHead = {};
        // Object.entries(config.defaultVars.kt).forEach(column => {
        //     if (head[column[0]]) {
        //         sortedHead[column[0]] = head[column[0]];
        //     }
        // });
        // console.log(sortedHead);
        this.setState({ head: { ...config.defaultVars.kt } });
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
            if (!status.isInner && !head[status.statusReport] && status.statusReport.trim() !== '') {
                const status2kt = Object.entries(config.defaultVars.kt).find(item => item[1].kts.includes(status.statusReport.trim()));
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

    transliterate(word) {
        let answer = '', a = {};
    
       a['Ё']='YO';a['Й']='I';a['Ц']='TS';a['У']='U';a['К']='K';a['Е']='E';a['Н']='N';a['Г']='G';a['Ш']='SH';a['Щ']='SCH';a['З']='Z';a['Х']='H';a['Ъ']='\'';
       a['ё']='yo';a['й']='i';a['ц']='ts';a['у']='u';a['к']='k';a['е']='e';a['н']='n';a['г']='g';a['ш']='sh';a['щ']='sch';a['з']='z';a['х']='h';a['ъ']='\'';
       a['Ф']='F';a['Ы']='I';a['В']='V';a['А']='a';a['П']='P';a['Р']='R';a['О']='O';a['Л']='L';a['Д']='D';a['Ж']='ZH';a['Э']='E';
       a['ф']='f';a['ы']='i';a['в']='v';a['а']='a';a['п']='p';a['р']='r';a['о']='o';a['л']='l';a['д']='d';a['ж']='zh';a['э']='e';
       a['Я']='Ya';a['Ч']='CH';a['С']='S';a['М']='M';a['И']='I';a['Т']='T';a['Ь']='\'';a['Б']='B';a['Ю']='YU';
       a['я']='ya';a['ч']='ch';a['с']='s';a['м']='m';a['и']='i';a['т']='t';a['ь']='\'';a['б']='b';a['ю']='yu';
    
       for (let i in word) {
         if (word.hasOwnProperty(i)) {
           if (a[word[i]] === undefined){
             answer += word[i];
           } else {
             answer += a[word[i]];
           }
         }
       }
       return answer;
    }

    findTask(statuses, kts) {
        if (statuses && statuses.length > 0) {
            return statuses.filter(status => kts.includes(status.statusReport));
        }
        return null;
    }

    findKts(statuses, kts) {
        if (statuses && statuses.length > 0) {
            return statuses.filter(status => kts.includes(status.kt));
        }
        return null;
    }

    render() {
        const { projects } = this.props;
        console.log('RENDER <StatusTable>');

        let classIc = this.state.showNames ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right';

        return <div className={'col-sm-12 col-md-12 ' + styles.main}>
            {
                projects.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {projects.errors}
                    </Alert>
                </div>
            }
            <div className={'table-responsive ' + styles.tableResponsitive} ref='tableContainer'>
                {projects.data.length > 0 && <table className={'table'}>
                    <thead className={styles.headHidden}>
                        <tr className={styles.head1}>
                            <th className={styles.paddingRight + ' ' + styles.r1Project} colSpan={this.state.showNames ? '3' : '2'}>
                                <p className={styles.prjsHead}>
                                Проекты&nbsp;<span className={'glyphicon ' + classIc + ' ' + styles.button + ' ' + styles.hideNameIco} onClick={this.showNames}></span>
                                </p>
                            </th>
                            <th className={styles.headStatus + ' ' + styles.r1status} colSpan={Object.entries(this.state.head).length - 1}>
                                Статус
                            </th>
                            <th className={styles.closeStatus + ' ' + styles.r1remove}>
                                <span className={'glyphicon glyphicon-remove ' + styles.button}></span>
                            </th>
                        </tr>
                        <tr>
                            <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.bordRight10 + ' ' + styles.r2number} colSpan='2'>
                                №
                            </th>
                            {this.state.showNames && <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.paddingRight + ' ' + styles.r2name}>
                                Наименование
                            </th>}
                            {Object.entries(this.state.head).map(val => {
                                return <th title={val[1].name} className={styles.mainSteps + ' ' + styles.borderBottom + ' ' + styles.leftBorder + ' ' + styles['r2' + this.transliterate(val[0])]} key={val[0]}>
                                    {val[0]}
                                </th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.empty} colSpan={Object.entries(this.state.head).length + 3}></td>
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
                                                let tasks = this.findTask(project.tasks, head[1].kts);
                                                let kts = this.findKts(project.tasks, head[1].kts);
                                                
                                                if (!tasks || tasks.length == 0) {
                                                    return <td key={'TD_' + head[0] + project._id} title={head[1].name} className={STATUSES['NONE']}>
                                                        <span className='glyphicon glyphicon-ban-circle'></span>
                                                    </td>
                                                } else if (tasks[0].isInner) {
                                                    return <td key={'TD_' + head[0] + project._id} title={head[1].name} className={STATUSES[tasks[0].status] + ' ' + styles.down}>
                                                        <span className='glyphicon glyphicon-arrow-down'></span>
                                                    </td>
                                                } else {
                                                    // console.log(project.name + ' / ' + head[1].name + ' / ', tasks);
                                                    return <td key={'TD_' + head[0] + project._id} title={head[1].name} className={STATUSES[tasks[0].status]}>
                                                        <DataCell tasks={kts} title={project.name} step={tasks[0]} uni={i + '-' + '_sub'} headerName={head[1].name} headerCode={head[0]} loc_icon={icon} project={project} />
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
                <div className={styles.fakeTable} ref='tableHead'>
                    {projects.data.length > 0 && <table className={'table'}>
                        <thead className={styles.headVisible}>
                            <tr className={styles.head1}>
                                <th className={styles.paddingRight + ' ' + styles.r1Project} colSpan={this.state.showNames ? '3' : '2'}>
                                    <p className={styles.prjsHead}>
                                    Проекты&nbsp;<span className={'glyphicon ' + classIc + ' ' + styles.button + ' ' + styles.hideNameIco} onClick={this.showNames}></span>
                                    </p>
                                </th>
                                <th className={styles.headStatus + ' ' + styles.r1status} colSpan={Object.entries(this.state.head).length - 1}>
                                    Статус
                                </th>
                                <th className={styles.closeStatus + ' ' + styles.r1remove}>
                                    <span className={'glyphicon glyphicon-remove ' + styles.button}></span>
                                </th>
                            </tr>
                            <tr>
                                <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.bordRight10 + ' ' + styles.r2number} colSpan='2'>
                                    №
                                </th>
                                {this.state.showNames && <th className={styles.headFade + ' ' + styles.borderBottom + ' ' + styles.paddingRight + ' ' + styles.r2name}>
                                    Наименование
                                </th>}
                                {Object.entries(this.state.head).map(val => {
                                    return <th title={val[1].name} className={styles.mainSteps + ' ' + styles.borderBottom + ' ' + styles.leftBorder + ' ' + styles['r2' + this.transliterate(val[0])]} key={val[0]}>
                                        {val[0]}
                                    </th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.empty} colSpan={Object.entries(this.state.head).length + 3}></td>
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
                                                    let tasks = this.findTask(project.tasks, head[1].kts);
                                                    let kts = this.findKts(project.tasks, head[1].kts);
                                                    
                                                    if (!tasks || tasks.length == 0) {
                                                        return <td key={'TD_' + head[0] + project._id} title={head[1].name} className={STATUSES['NONE']}>
                                                            <span className='glyphicon glyphicon-ban-circle'></span>
                                                        </td>
                                                    } else if (tasks[0].isInner) {
                                                        return <td key={'TD_' + head[0] + project._id} title={head[1].name} className={STATUSES[tasks[0].status] + ' ' + styles.down}>
                                                            <span className='glyphicon glyphicon-arrow-down'></span>
                                                        </td>
                                                    } else {
                                                        // console.log(project.name + ' / ' + head[1].name + ' / ', tasks);
                                                        return <td key={'TD_' + head[0] + project._id} title={head[1].name} className={STATUSES[tasks[0].status]}>
                                                            <DataCell tasks={kts} title={project.name} step={tasks[0]} uni={i + '-' + '_sub'} headerName={head[1].name} headerCode={head[0]} loc_icon={icon} project={project} />
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
            </div>
        </div>;
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }