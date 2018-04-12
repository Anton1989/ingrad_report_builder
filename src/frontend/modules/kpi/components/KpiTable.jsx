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
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePlane = this.handleChangePlane.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    handleAdd() {
        let project = { ...this.props.project };
        let events = [...project.events, {
            name: '',
            kv1: '',
            kv2: '',
            kv3: '',
            year: '',
            actual: '',
            weight: '',
            critical: ''
        }];
        project.events = events;
        this.props.save(project);
    }

    handleChange(name, value) {
        let project = { ...this.props.project };
        project[name] = value;
        this.props.save(project);
    }

    handleChangePlane(index, name, value) {
        let project = { ...this.props.project };
        let plane = { ...project.planes[index] };
        plane[name] = value;
        project.planes[index] = plane;
        this.props.save(project);
    }

    handleChangeEvent(index, name, value) {
        let project = { ...this.props.project };
        let event = { ...project.events[index] };
        event[name] = value;
        project.events[index] = event;
        this.props.save(project);
    }

    handleRemove(index) {
        let project = { ...this.props.project };
        project.events.splice(index, 1);
        this.props.save(project);
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
            {project && <div className='table-responsive'>
                <p>
                    <EditableField name='role' value={project.role} save={this.handleChange} />
                </p>
                <table className={'table table-bordered ' + styles.kpiTable}>
                    <thead className={styles.head}>
                        <tr>
                            <th rowSpan='2'>№ пп</th>
                            <th rowSpan='2'>Проекты</th>
                            <th className={styles.editable + ' ' + styles.mainCol} colSpan='5'>
                                <EditableField name='title' value={project.title} save={this.handleChange} />
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
                                1 <EditableField name='name' value={project.name} save={this.handleChange} />
                            </td>
                        </tr>
                        {project && project.planes && project.planes.map((plan, i) => {
                            return <tr key={plan._id}>
                                <td>{i + 1}.</td>
                                <td>{plan.name}</td>
                                <td className={styles.editable}>
                                    <EditableField name='kv1' value={plan.kv1} save={(name, value) => {
                                        this.handleChangePlane(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='kv2' value={plan.kv2} save={(name, value) => {
                                        this.handleChangePlane(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='kv3' value={plan.kv3} save={(name, value) => {
                                        this.handleChangePlane(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='year' value={plan.year} save={(name, value) => {
                                        this.handleChangePlane(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='actual' value={plan.actual} save={(name, value) => {
                                        this.handleChangePlane(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='weight' value={plan.weight} save={(name, value) => {
                                        this.handleChangePlane(i, name, value);
                                    }} />
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
                                    <button type='button' className='btn btn-default' onClick={() => { this.handleRemove(i) }}><span className='glyphicon glyphicon-remove'></span></button>
                                </td>
                                <td>4.{i + 1}. <EditableField name='name' value={event.name} save={(name, value) => {
                                    this.handleChangeEvent(i, name, value);
                                }} /></td>
                                <td className={styles.editable}>
                                    <EditableField name='kv1' value={event.kv1} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='kv2' value={event.kv2} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='kv3' value={event.kv3} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='year' value={event.year} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='actual' value={event.actual} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='weight' value={event.weight} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
                                </td>
                                <td className={styles.editable}>
                                    <EditableField name='critical' value={event.critical} save={(name, value) => {
                                        this.handleChangeEvent(i, name, value);
                                    }} />
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
                        <button type='button' className='btn btn-info' onClick={this.handleAdd}><span className='glyphicon glyphicon-plus'></span></button>
                    </tbody>
                </table>
            </div>}
        </div>
    }
}

KpiTable.propTypes = {
    project: PropTypes.object,
    save: PropTypes.func.isRequired,
    dismissError: PropTypes.func.isRequired
}
