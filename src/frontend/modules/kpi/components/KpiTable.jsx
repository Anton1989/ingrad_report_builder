import React from 'react';
import PropTypes from 'prop-types';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
import EditableField from '../components/EditableField.jsx';
// import Row from '../components/Row.jsx';
import styles from './KpiTable.scss';

export default class KpiTable extends React.Component {

    constructor(...props) {
        super(...props);

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }
    
    render() {
        const { project, errors, fetching } = this.props;
        console.log('RENDER <KpiTable>', project);

        return <div className='table-responsive'>
            {
                errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {errors}
                    </Alert>
                </div>
            }
            {project && <table className={'table table-bordered ' + styles.kpiTable}>
                <thead className={styles.head}>
                    <tr>
                        <th rowSpan='2'>№ пп</th>
                        <th rowSpan='2'>Проекты</th>
                        <th className={styles.editable + ' ' + styles.mainCol} colSpan='5'>
                            <EditableField name='title' value={project.title} save={() => {}} />
                        </th>
                        <th rowSpan='2'>Вес</th>
                        <th rowSpan='2'>Шкала</th>
                        <th rowSpan='2'>Источник информации</th>
                    </tr>
                    <tr>
                        <th>I кв</th>
                        <th>II кв</th>
                        <th>III кв</th>
                        <th>Годовой</th>
                        <th>Факт на текщий КВ</th>
                    </tr>
                </thead>
                <tbody>
                    {fetching && <tr><td colSpan='10'><Loading /></td></tr>}
                    <tr>
                        <td colSpan='10' className={styles.editable}>
                            1 <EditableField name='name' value={project.name} save={() => {}} />
                        </td>
                    </tr>
                    {project && project.planes && project.planes.map((plan, i) => {
                        return <tr key={plan._id}>
                            <td>{i+1}.</td>
                            <td>{plan.name}</td>
                            <td className={styles.editable}>
                                <EditableField  name='kv1' value={plan.kv1} save={() => {}} />
                            </td>
                            <td className={styles.editable}>
                                <EditableField  name='kv2' value={plan.kv2} save={() => {}} />
                            </td>
                            <td className={styles.editable}>
                                <EditableField  name='kv3' value={plan.kv3} save={() => {}} />
                            </td>
                            <td className={styles.editable}>
                                <EditableField  name='year' value={plan.year} save={() => {}} />
                            </td>
                            <td className={styles.editable}>
                                <EditableField  name='actual' value={plan.actual} save={() => {}} />
                            </td>
                            <td className={styles.editable}>
                                <EditableField  name='weight' value={plan.weight} save={() => {}} />
                            </td>
                            <td dangerouslySetInnerHTML={{__html: plan.rate}}></td>
                            <td dangerouslySetInnerHTML={{__html: plan.info}}></td>
                        </tr>;
                    })}
                    <tr className={styles.head}>
                        <td className={styles.unhead}></td>
                        <td colSpan='6'>Дата выполнения ключевого события</td>
                        <td>Вес</td>
                        <td>Критичность срыва сроков</td>
                        <td>Описание критичности</td>
                    </tr>
                </tbody>
            </table>}
        </div>
    }
}

KpiTable.propTypes = {
    project: PropTypes.object,
    dismissError: PropTypes.func.isRequired
}
