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

        this.state = {
            styles: {}
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePlane = this.handleChangePlane.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentWillMount() {
        this.parseStyles();
    }

    componentWillReceiveProps(newProps) {
        this.parseStyles(newProps);
    }

    parseStyles(props = this.props) {
        let styles = {};
        props.kpiStyles.forEach(style => {
            styles[style._id] = {
                fontWeight: style.textStyle,
                backgroundColor: style.cellColor,
                color: style.textColor
            }
        });

        this.setState({ styles });
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

    handleChange(name, value, style) {
        let project = { ...this.props.project };
        project[name] = value;
        project[name + 'Style'] = style;
        this.props.save(project);
    }

    handleChangePlane(index, name, value, style) {
        let project = { ...this.props.project };
        let plane = { ...project.planes[index] };
        plane[name] = value;
        plane[name + 'Style'] = style;
        project.planes[index] = plane;
        this.props.save(project);
    }

    handleChangeEvent(index, name, value, style) {
        let project = { ...this.props.project };
        let event = { ...project.events[index] };
        event[name] = value;
        event[name + 'Style'] = style;
        project.events[index] = event;
        this.props.save(project);
    }

    handleRemove(index) {
        let project = { ...this.props.project };
        project.events.splice(index, 1);
        this.props.save(project);
    }

    render() {
        const { project, errors, kpiStyles, fetching } = this.props;
        console.log('RENDER <KpiTable>', this.state.styles);

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
                    РОЛЬ: <EditableField kpiStyles={kpiStyles} name='role' value={project.role} save={this.handleChange} />
                </p>
                <table className={'table table-bordered ' + styles.kpiTable}>
                    <thead className={styles.head}>
                        <tr>
                            <th className={styles.center} rowSpan='2'>Наименование показателей</th>
                            <th style={project.titleStyle ? this.state.styles[project.titleStyle] : {}} className={styles.editable + ' ' + styles.mainCol} colSpan='5'>
                                <EditableField kpiStyles={kpiStyles} name='title' value={project.title} style={project.titleStyle} save={this.handleChange} />
                            </th>
                            <th rowSpan='2'>Вес</th>
                            <th className={styles.center} rowSpan='2'>Шкала</th>
                            <th className={styles.center} rowSpan='2'>Источник информации</th>
                        </tr>
                        <tr>
                            <th className={styles.quarts}>I кв</th>
                            <th className={styles.quarts}>II кв</th>
                            <th className={styles.quarts}>III кв</th>
                            <th className={styles.quarts}>Годовой</th>
                            <th className={styles.quarts}>Факт на текщий квартал</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fetching && <tr><td colSpan='9'><Loading /></td></tr>}
                        <tr>
                            <td style={project.nameStyle ? this.state.styles[project.nameStyle] : {}} colSpan='9' className={styles.editable}>
                                <EditableField kpiStyles={kpiStyles} name='name' value={project.name} style={project.nameStyle} save={this.handleChange} />
                            </td>
                        </tr>
                        {project && project.planes && project.planes.map((plan, i) => {
                            return <tr key={plan._id}>
                                <td style={plan.nameStyle ? this.state.styles[plan.nameStyle] : {}} className={styles.editable}>{i + 1}. <EditableField kpiStyles={kpiStyles} name='name' value={plan.name} style={plan.kv1Style} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                }} /></td>
                                <td style={plan.kv1Style ? this.state.styles[plan.kv1Style] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='kv1' value={plan.kv1} style={plan.kv1Style} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.kv2Style ? this.state.styles[plan.kv2Style] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='kv2' value={plan.kv2} style={plan.kv2Style} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.kv3Style ? this.state.styles[plan.kv3Style] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='kv3' value={plan.kv3} style={plan.kv3Style} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.yearStyle ? this.state.styles[plan.yearStyle] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='year' value={plan.year} style={plan.yearStyle} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.actualStyle ? this.state.styles[plan.actualStyle] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='actual' value={plan.actual} style={plan.actualStyle} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.weightStyle ? this.state.styles[plan.weightStyle] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='weight' value={plan.weight} style={plan.weightStyle} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.rateStyle ? this.state.styles[plan.rateStyle] : {}} className={styles.editable}>
                                    <EditableField kpiStyles={kpiStyles} name='rate' value={plan.rate} textarea={true} style={plan.rateStyle} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                                <td style={plan.infoStyle ? this.state.styles[plan.infoStyle] : {}} className={styles.editable}>
                                    <EditableField kpiStyles={kpiStyles} name='info' value={plan.info} textarea={true} style={plan.infoStyle} save={(name, value, style) => {
                                        this.handleChangePlane(i, name, value, style);
                                    }} />
                                </td>
                            </tr>;
                        })}
                        <tr className={styles.head}>
                            <td colSpan='6'>Дата выполнения ключевого события</td>
                            <td>Вес</td>
                            <td className={styles.center}>Критичность срыва сроков</td>
                            <td className={styles.center}>Описание критичности</td>
                        </tr>
                        {project && project.events && project.events.map((event, i) => {
                            return <tr key={event._id}>
                                <td style={event.nameStyle ? this.state.styles[event.nameStyle] : {}}>
                                    <button type='button' className='btn btn-default' onClick={() => { this.handleRemove(i) }}><span className='glyphicon glyphicon-remove'></span></button>
                                    &nbsp; 4.{i + 1}. <EditableField kpiStyles={kpiStyles} name='name' value={event.name} style={event.nameStyle} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.kv1Style ? this.state.styles[event.kv1Style] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='kv1' value={event.kv1} style={event.kv1Style} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.kv2Style ? this.state.styles[event.kv2Style] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='kv2' value={event.kv2} style={event.kv2Style} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.kv3Style ? this.state.styles[event.kv3Style] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='kv3' value={event.kv3} style={event.kv3Style} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.yearStyle ? this.state.styles[event.yearStyle] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='year' value={event.year} style={event.yearStyle} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.actualStyle ? this.state.styles[event.actualStyle] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='actual' value={event.actual} style={event.actualStyle} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.weightStyle ? this.state.styles[event.weightStyle] : {}} className={styles.editable}>
                                    <EditableField kpiStyles={kpiStyles} name='weight' value={event.weight} style={event.weightStyle} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                <td style={event.criticalStyle ? this.state.styles[event.criticalStyle] : {}} className={styles.editable + ' ' + styles.center}>
                                    <EditableField kpiStyles={kpiStyles} name='critical' value={event.critical} style={event.criticalStyle} save={(name, value, style) => {
                                        this.handleChangeEvent(i, name, value, style);
                                    }} />
                                </td>
                                {i == 0 && <td rowSpan={project.events.length} style={project.cdescStyle ? this.state.styles[project.cdescStyle] : {}} className={styles.editable}>
                                    <EditableField kpiStyles={kpiStyles} name='cdesc' value={project.cdesc} textarea={true} style={project.cdescStyle} save={this.handleChange} />
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
    kpiStyles: PropTypes.array.isRequired,
    save: PropTypes.func.isRequired,
    dismissError: PropTypes.func.isRequired
}
