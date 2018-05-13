import React from 'react';
// import PropTypes from 'prop-types';
import styles from './Details.scss';
import DataCell from './DataCell.jsx';

const STATUSES = {
    'IN PLAN': styles.inPlan,
    'IN PROGRESS': styles.inProgress,
    'DONE': styles.done
}

export default class Details extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        if (this.props.details.length == 0 && this.props.fetching !== true) {
            this.props.getDetails(this.props.id);
        }
    }

    render() {
        const { details, showNames } = this.props;
        console.log('RENDER <Details>');

        return <React.Fragment>
            {details.map(building => {
            // let projectStatuse = status.data.find(item => item.project_id == building._id);

            return <tr>
                <td className={styles.number}>
                </td>
                <td className={styles.bordRight10}>
                </td>
                {showNames && <td className={styles.selectedCell + ' ' + styles.paddingRight}>
                    <p className={styles.nameProj}>{building.name}</p>
                </td>}

                {building.steps.map((mainStep, i) => {
                    return mainStep.subSteps.map((subStep, j) => {
                        return <td className={STATUSES[subStep.status]}>
                            <DataCell step={subStep} uni={i + '-' + j} header={subStep.name} loc_icon={null} project={building} />
                        </td>
                    });
                })}
            </tr>;
        })}
        </React.Fragment>
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }