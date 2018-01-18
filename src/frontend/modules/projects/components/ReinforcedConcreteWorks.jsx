import React from 'react';
import PropTypes from 'prop-types';
import styles from './ReinforcedConcreteWorks.scss';
//Utiles
// import { getFloorNumbers } from '../../../utiles/match';

const TYPES = {
    mach: 'Маш.помещ.',
    tech: 'Тех.этаж',
    general: 'Этаж',
    underground: 'Подвал'
}

export default class ReinforcedConcreteWorks extends React.Component {

    generateRows(project) {
        // let floors = getFloorNumbers(sections);
        return project.floors.map(floor => {
            
            return <tr key={floor._id}>
                <td className={styles.rightAlign}>№{floor.number}</td>
                <td className={styles.rightAlign}>{TYPES[floor.type]}</td>
                {project.sections.map(section => {
                    let td = null;
                    if (section.floors.findIndex(floorSection => floorSection == floor._id) === -1) {
                        td = <td key={section._id + floor._id} className={styles.empty}></td>;
                    } else {
                        td = <td key={section._id + floor._id} className={styles.active}>{Math.floor(Math.random() * 101)}</td>;
                    }
                    return td;
                })}
                <td className={styles.summ}>{Math.floor(Math.random() * 101)}</td>
            </tr>
        });
    }

    render() {
        const { project } = this.props;
        console.log('RENDER <ReinforcedConcreteWorks>');

        return <div className={'table-responsive ' + styles.tableReinforcedConcreteWorks}>
            <table className={'table table-bordered'}>
                <thead>
                    <tr>
                        <th rowSpan='2' className={styles.thName}>Этаж</th>
                        <th rowSpan='2' className={styles.thName}>Название</th>
                        <th colSpan={project.sections.length}>Секции</th>
                        <th rowSpan='2' className={styles.thName}></th>
                    </tr>
                    <tr>
                        {project.sections.map(section => <th key={'th'+section._id} className={styles.sectionNames}>{section.name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        {project.sections.map(section => <td key={'summ'+section._id} className={styles.summ}>{Math.floor(Math.random() * 101)}</td>)}
                        <td className={styles.summ}>&#8721;</td>
                    </tr>
                    {this.generateRows(project)}
                </tbody>
            </table>
        </div>
    }
}

ReinforcedConcreteWorks.propTypes = {
    project: PropTypes.object
}