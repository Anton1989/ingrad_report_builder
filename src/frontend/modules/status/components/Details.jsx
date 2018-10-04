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

    renderTree(heads, projects, showNames, offset, projectId, handleShowBuilds, code, title, openProjects) {
        const buildings = projects.filter(sub => code == sub.parent);
        if (buildings && buildings.length > 0) {
            return buildings.map(building => {
                const hasDetails = openProjects && openProjects.includes(building.code);
                const curTitle = title + ' - ' + building.name;
                // let projectStatuse = status.data.find(item => item.project_id == building._id);
                return <React.Fragment key={'CONTENT_' + building._id}>
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
                            let tasks = this.findTask(building.tasks, head[1].kts);
                            let kts = this.findKts(building.tasks, head[1].kts);
                            
                            if (!tasks || tasks.length == 0) {
                                return <td key={'SUBNONE' + i + building._id} title={head[1].name} className={STATUSES['NONE']}>
                                    <span className='glyphicon glyphicon-ban-circle'></span>
                                </td>
                            } else if (tasks[0].isInner) {
                                return <td key={'SUBNONE' + i + building._id} title={head[1].name} className={STATUSES[tasks[0].status] + ' ' + styles.down}>
                                    <span className='glyphicon glyphicon-arrow-down'></span>
                                </td>
                            } else {
                                return <td key={'SUB_TD' + head[0] + building._id} title={head[1].name} className={STATUSES[tasks[0].status]}>
                                    <DataCell title={curTitle} tasks={kts} step={tasks[0]} uni={i + '-' + '_sub'} headerName={tasks[0].name} headerCode={tasks[0].statusReport} loc_icon={null} project={building} />
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