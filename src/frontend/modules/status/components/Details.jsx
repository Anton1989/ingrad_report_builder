import React from 'react';
// import PropTypes from 'prop-types';
import styles from './Details.scss';
import DataCell from './DataCell.jsx';

const STATUSES = {
    'IN PLAN': styles.inPlan,
    'IN PROGRESS': styles.inProgress,
    'DONE': styles.done,
    'NONE': styles.none
}

export default class Details extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    findTask(statuses, object) {
        if (statuses && statuses.length > 0) {
            return statuses.find(status => status.kt == object.kt);
        }
        return null;
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

    renderTree(heads, projects, showNames, offset, projectId, handleShowBuilds, code, title, openProjects) {
        const buildings = projects.filter(sub => code == sub.parent);
        if (buildings && buildings.length > 0) {
            return buildings.map(building => {
                const hasDetails = openProjects && openProjects.includes(building.code);
                console.log(building, hasDetails)
                const curTitle = title + ' - ' + building.name;
                // let projectStatuse = status.data.find(item => item.project_id == building._id);
                return <React.Fragment>
                    <tr key={'SUBROW' + building._id}>
                        <td className={styles.number}>
                        </td>
                        <td className={styles.bordRight10}>
                        </td>
                        {showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>
                            <p className={styles.plus} onClick={() => { handleShowBuilds(projectId, building.code); }}><span style={{ paddingRight: (offset * 15) + 'px' }}></span><span className={'glyphicon ' + (hasDetails ? 'glyphicon-minus' : 'glyphicon-plus')}></span></p>
                            <p className={styles.nameProj}>{building.name}</p>
                        </td>}
                        
                        {Object.entries(heads).map((head, i) => {
                            let status = this.findTask(building.tasks, head[1]);
                            
                            if (!status) {
                                return <td key={'SUBNONE' + i + building._id} className={STATUSES['NONE']}>
                                    <span className='glyphicon glyphicon-ban-circle'></span>
                                </td>
                            } else {
                                return <td key={'SUB_TD' + head[1].kt + building._id} title={head[1].name} className={STATUSES[this.getStatus(status)]}>
                                    <DataCell title={curTitle} step={status} uni={i + '-' + '_sub'} header={status.name} loc_icon={null} project={building} />
                                </td>
                            }
                        })}
                    </tr>
                    {hasDetails && this.renderTree(heads, projects, showNames, (offset+1), projectId, handleShowBuilds, building.code, curTitle, openProjects)}
                </React.Fragment>;
            });
        }
        return null;
    }

    render() {
        const { projects, heads, showNames, projectId, handleShowBuilds, code, title, openProjects } = this.props;
        console.log('RENDER <Details>');

        return this.renderTree(heads, projects, showNames, 1, projectId, handleShowBuilds, code, title, openProjects);
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }