import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
//Components
import styles from './Header.scss';
//Utiles
import { calculateFloors } from '../../../utiles/match';

export default class Header extends React.Component {

    render() {
        const { project } = this.props;
        console.log('RENDER <Header>');

        let floors = null;
        if (project) {
            floors = calculateFloors(project.sections);
        }

        return <div className={'row ' + styles.pageHeader}>
            <div className={'col-xs-4 col-sm-4 col-md-4 col-lg-3 ' + styles.name}>
                <p>{project.city}<br />
                    {project.comercialName}</p>

                <p className={styles.developer}>{project.subject} | {project.toType} <br />
                    {project.counterparty}</p>
            </div>
            <div className={'col-xs-4 col-sm-4 col-md-4 col-lg-3 ' + styles.plans}>
                <span>Факт</span>
                <div className='progress'>
                    <div className='progress-bar progress-bar-warning' role='progressbar' style={{ width: '29%' }}>
                        <span>29% Факт</span>
                    </div>
                </div>

                <span>План</span>
                <div className='progress'>
                    <div className='progress-bar progress-bar-info' role='progressbar' style={{ width: '37%' }}>
                        <span>37% План</span>
                    </div>
                </div>

                <span>Отклонение</span>
                <div className='progress'>
                    <div className='progress-bar progress-bar-danger' role='progressbar' style={{ width: '8%' }}>
                        <span>8% Отклонение</span>
                    </div>
                </div>
            </div>
            <div className={'col-xs-4 col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-lg-offset-2 col-md-offset-0 ' + styles.area}>
                <div className='row'>
                    <div className='col-xs-12 col-sm-6'>
                        Статус: <span className={styles.status}>2</span>
                    </div>
                    <div className='col-xs-12 col-sm-6'>
                        <p>
                            Sзастр, м2: {project.buildingArea}<br />
                            Sкв, м2: {project.generalArea}
                        </p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-12 col-sm-6'>
                        <p>
                            Этажи: {floors.min}-{floors.max}<br />
                            Секции: {project.sections.length}
                        </p>
                    </div>
                    <div className='col-xs-12 col-sm-6'>
                        <p>
                            Начало: { moment(project.startCMP).format('DD/MM/YY') }<br />
                            Окончание: { moment(project.endCMP).format('DD/MM/YY') }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    }
}
Header.propTypes = {
    project: PropTypes.object
}