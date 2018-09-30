import React from 'react';
import styles from './Objects.scss';

export default class Camera extends React.Component {

    render() {
        const { house, i, mapStyles, updateInputTextHouse, onUpdateInputTextPoint } = this.props;

        const icons = [
            '0', '15', '30', '45', '60', '75', '90', '105', '120', '135', '150', '165', '180', '195', '210', '240', '255', '270', '285'
        ];
        
        return <div className={'form-group row ' + styles.house} key={'house_' + i}>
            <div className='form-group col-sm-12 col-md-12'>
                <div className={'row ' + styles.line}>
                    <div className='col-xs-3'>
                        <input type='text' className='form-control' id='name' placeholder='Навание' value={house.name} onChange={e => updateInputTextHouse(e)} />
                    </div>
                    <div className='col-xs-3'>
                        <select id='style' className='form-control' value={house.style ? house.style : mapStyles.length > 0 ? mapStyles[0]._id : ''} onChange={e => updateInputTextHouse(e)}>
                            {mapStyles.length > 0 && mapStyles.map(style => {
                                return <option key={style._id} value={style._id}>Стиль: {style.name}</option>;
                            })}
                        </select>
                    </div>
                    <div className='col-xs-3'>
                        <input type='text' className='form-control' id='status' placeholder='Статус' value={house.status} onChange={e => updateInputTextHouse(e)} />
                    </div>
                    <div className='col-xs-3'>
                        <select id='ugol' className='form-control' value={house.ugol} onChange={e => updateInputTextHouse(e)}>
                            {icons.map(icon => {
                                return <option key={icon} value={icon}>Поворот {icon}&#176;</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className={'row ' + styles.line}>
                    <div className='col-xs-3'>
                        <input type='text' className='form-control' id='camera' placeholder='Камера' value={house.camera} onChange={e => updateInputTextHouse(e)} />
                    </div>
                    <div className='col-xs-3'>
                        <select id='type' className='form-control' value={(house.type && house.type != '') ? house.type : 'house'} onChange={e => updateInputTextHouse(e)}>
                            <option value='house'>Тип: Дом</option>
                            <option value='tube'>Тип: Коммуникации</option>
                            <option value='camera'>Тип: Камера</option>
                        </select>
                    </div>
                    <div className='col-xs-3'>
                        <input type='text' className='form-control' id='lat' placeholder='Широта' value={house.coordinates[0] ? house.coordinates[0].lat : ''} onChange={e => onUpdateInputTextPoint(e, 0)} />
                    </div>
                    <div className='col-xs-3'>
                        <input type='text' className='form-control' id='lng' placeholder='Долгота' value={house.coordinates[0] ? house.coordinates[0].lng : ''} onChange={e => onUpdateInputTextPoint(e, 0)} />
                    </div>
                </div>
            </div>
        </div>
    }
}
