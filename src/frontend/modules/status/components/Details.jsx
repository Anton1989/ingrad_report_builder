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

    renderTree(heads, projects, showNames, offset) {
        if (projects) {
            return projects.map(building => {
                // let projectStatuse = status.data.find(item => item.project_id == building._id);
                return <React.Fragment>
                    <tr key={'SUBROW' + building._id}>
                        <td className={styles.number}>
                        </td>
                        <td className={styles.bordRight10}>
                        </td>
                        {showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>
                            <p className={styles.nameProj}>{offset}{building.name}</p>
                        </td>}
                        
                        {Object.entries(heads).map((head, i) => {
                            let status = this.findTask(building.statuses, head[1]);
                            
                            if (!status) {
                                return <td key={'SUBNONE' + i + building._id} className={STATUSES['NONE']}>
                                    <span className='glyphicon glyphicon-ban-circle'></span>
                                </td>
                            } else {
                                return <td key={'SUB_TD' + head[1].kt + building._id} title={head[1].name} className={STATUSES[this.getStatus(status)]}>
                                    <DataCell step={status} uni={i + '-' + '_sub'} header={status.name} loc_icon={null} project={building} />
                                </td>
                            }
                        })}
                    </tr>
                    {this.renderTree(heads, building.childes, showNames, <span>{offset}-&nbsp;</span>)}
                </React.Fragment>;
            });
        }
    }

    render() {
        const { projects, heads, showNames } = this.props;
        console.log('RENDER <Details>');

        return this.renderTree(heads, projects, showNames, null);
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }