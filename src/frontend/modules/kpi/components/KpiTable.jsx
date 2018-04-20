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

        this.state = {
            styles: {}
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
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

    render() {
        const { project, errors, fetching } = this.props;
        console.log('RENDER <KpiTable>');

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
                        <th className={styles.center} rowSpan='2'>Наименование показателей</th>
                        <th style={project.titleStyle ? this.state.styles[project.titleStyle] : {}} className={styles.mainCol} colSpan='5'>{project.title}</th>
                        <th rowSpan='2'>Вес</th>
                        <th className={styles.center} rowSpan='2'>Шкала</th>
                        <th rowSpan='2' className={styles.center}>Источник информации</th>
                    </tr>
                    <tr>
                        <th className={styles.quarts}>I кв</th>
                        <th className={styles.quarts}>II кв</th>
                        <th className={styles.quarts}>III кв</th>
                        <th className={styles.quarts}>Годовой</th>
                        <th className={styles.quarts}>Факт на текущий квартал</th>
                    </tr>
                </thead>
                <tbody>
                    {fetching && <tr><td colSpan='9'><Loading /></td></tr>}
                    <tr>
                        <td style={project.nameStyle ? this.state.styles[project.nameStyle] : {}} colSpan='9'>
                            {project.name}
                        </td>
                    </tr>
                    {project && project.planes && project.planes.map((plan, i) => {
                        return <tr key={plan._id}>
                            <td>{i + 1}. {plan.name}</td>
                            <td style={plan.kv1Style ? this.state.styles[plan.kv1Style] : {}} className={styles.center}>
                                {plan.kv1}
                            </td>
                            <td style={plan.kv2Style ? this.state.styles[plan.kv2Style] : {}} className={styles.center}>
                                {plan.kv2}
                            </td>
                            <td style={plan.kv3Style ? this.state.styles[plan.kv3Style] : {}} className={styles.center}>
                                {plan.kv3}
                            </td>
                            <td style={plan.yearStyle ? this.state.styles[plan.yearStyle] : {}} className={styles.center}>
                                {plan.year}
                            </td>
                            <td style={plan.actualStyle ? this.state.styles[plan.actualStyle] : {}} className={styles.center}>
                                {plan.actual}
                            </td>
                            <td style={plan.weightStyle ? this.state.styles[plan.weightStyle] : {}}>
                                {plan.weight}
                            </td>
                            <td dangerouslySetInnerHTML={{ __html: plan.rate }}></td>
                            <td dangerouslySetInnerHTML={{ __html: plan.info }}></td>
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
                            <td style={event.nameStyle ? this.state.styles[event.nameStyle] : {}}>4.{i + 1}. {event.name}</td>
                            <td style={event.kv1Style ? this.state.styles[event.kv1Style] : {}} className={styles.center}>
                                {event.kv1}
                            </td>
                            <td style={event.kv2Style ? this.state.styles[event.kv2Style] : {}} className={styles.center}>
                                {event.kv2}
                            </td>
                            <td style={event.kv3Style ? this.state.styles[event.kv3Style] : {}} className={styles.center}>
                                {event.kv3}
                            </td>
                            <td style={event.yearStyle ? this.state.styles[event.yearStyle] : {}} className={styles.center}>
                                {event.year}
                            </td>
                            <td style={event.actualStyle ? this.state.styles[event.actualStyle] : {}} className={styles.center}>
                                {event.actual}
                            </td>
                            <td style={event.weightStyle ? this.state.styles[event.weightStyle] : {}}>
                                {event.weight}
                            </td>
                            <td style={event.criticalStyle ? this.state.styles[event.criticalStyle] : {}} className={styles.center}>
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
    kpiStyles: PropTypes.array.isRequired,
    save: PropTypes.func.isRequired,
    dismissError: PropTypes.func.isRequired
}
