import React from 'react';
import PropTypes from 'prop-types';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
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
            {project && <a href={'/v1/kpi/' + project._id} target='_blank' className='btn btn-info'><span className='glyphicon glyphicon glyphicon-download'></span> Скачать в EXCEL</a>}
            <br/><br/>
            {project && <table className={'table table-bordered ' + styles.kpiTable}>
                <thead className={styles.head}>
                    <tr>
                        <th rowSpan='2'>№ пп</th>
                        <th rowSpan='2'>Проекты</th>
                        <th className={styles.editable + ' ' + styles.mainCol} colSpan='5'>{project.title}</th>
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
                        <td colSpan='10'>
                            1 {project.name}
                        </td>
                    </tr>
                    {project && project.planes && project.planes.map((plan, i) => {
                        return <tr key={plan._id}>
                            <td>{i + 1}.</td>
                            <td>{plan.name}</td>
                            <td >
                                {plan.kv1}
                            </td>
                            <td >
                                {plan.kv2}
                            </td>
                            <td >
                                {plan.kv3}
                            </td>
                            <td >
                            {plan.year}
                            </td>
                            <td>
                            {plan.actual}
                            </td>
                            <td>
                            {plan.weight}
                            </td>
                            <td dangerouslySetInnerHTML={{ __html: plan.rate }}></td>
                            <td dangerouslySetInnerHTML={{ __html: plan.info }}></td>
                        </tr>;
                    })}
                    <tr className={styles.head}>
                        <td className={styles.unhead}></td>
                        <td colSpan='6'>Дата выполнения ключевого события</td>
                        <td>Вес</td>
                        <td>Критичность срыва сроков</td>
                        <td>Описание критичности</td>
                    </tr>
                    {project && project.events && project.events.map((event, i) => {
                        return <tr key={event._id}>
                            <td>
                            </td>
                            <td>4.{i + 1}. {event.name}</td>
                            <td>
                            {event.kv1}
                            </td>
                            <td>
                            {event.kv2}
                            </td>
                            <td>
                            {event.kv3}
                            </td>
                            <td>
                            {event.year}
                            </td>
                            <td>
                            {event.actual}
                            </td>
                            <td>
                            {event.weight}
                            </td>
                            <td>
                            {event.critical}
                            </td>
                            {i == 0 && <td rowSpan={project.events.length}>
                                <b>Если в графе стоит - 0</b><br />
                                то срыв на 1 месяц обнуляет это событие<br />
                                <b>Если в графе стоит - 1</b><br />
                                - то срыв на 1 месяц дает 90% от этого события в общую сумму KPI<br />
                                - срыв на 2 месяца обнуляет это событие<br />
                                <b>Если в графе стоит - 2</b><br />
                                - то срыв на 1 месяц дает 90% от этого события в общую сумму KPI<br />
                                - то срыв на 2 месяц дает 80% от этого события в общую сумму KPI<br />
                                - срыв на 3 месяца обнуляет это событие<br />
                            </td>}
                        </tr>;
                    })}
                </tbody>
            </table>}
        </div>
    }
}

KpiTable.propTypes = {
    project: PropTypes.object,
    save: PropTypes.func.isRequired,
    dismissError: PropTypes.func.isRequired
}
