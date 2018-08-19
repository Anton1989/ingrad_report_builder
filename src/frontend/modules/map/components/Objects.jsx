import React from 'react';
import styles from './Objects.scss';

export default class Objects extends React.Component {

    render() {
        const { house, i, mapStyles, onRemoveHouse, updateInputTextHouse, updateCoordinatesByString, onUpdateInputTextPoint, onAddPoint, onRemovePoint } = this.props;
        
        return <div className={'form-group row ' + styles.house} key={'house_' + i}>
            <div className='col-xs-12'>
                <button type='button' className='btn btn-danger' onClick={() => { onRemoveHouse(i) }}>Удалить дом</button>
            </div>
            <div className='col-xs-4'>
                <input type='text' className='form-control' id='name' placeholder='Навание' value={house.name} onChange={e => updateInputTextHouse(e, i)} />
            </div>
            <div className='col-xs-4'>
                <select id='style' className='form-control' value={house.style ? house.style : mapStyles.length > 0 ? mapStyles[0]._id : ''} onChange={e => updateInputTextHouse(e, i)}>
                    {mapStyles.length > 0 && mapStyles.map(style => {
                        return <option key={style._id} value={style._id}>Стиль: {style.name}</option>;
                    })}
                </select>
            </div>
            <div className='col-xs-4'>
                <input type='text' className='form-control' id='status' placeholder='Статус' value={house.status} onChange={e => updateInputTextHouse(e, i)} />
            </div>
            <div className='col-xs-4'>
                <select id='type' className='form-control' value={(house.type && house.type != '') ? house.type : 'house'} onChange={e => updateInputTextHouse(e, i)}>
                    <option value='house'>Тип: Дом</option>
                    <option value='tube'>Тип: Коммуникации</option>
                    <option value='camera'>Тип: Камера</option>
                </select>
            </div>
            <div className={'col-xs-4 ' + styles.apply_path_by_str}>
                <input type='text' ref='coorStr' className='form-control' id='status' placeholder='Добавить координаты строкой' />
                <button type='button' className='btn btn-info' onClick={e => updateCoordinatesByString(e, i)}><span className='glyphicon glyphicon-plus-sign'></span></button>
            </div>
            <div className='row'>
                <div className='form-group col-xs-4 row'>
                    <div className='col-xs-6'>
                        <input type='text' className='form-control' id='lat' placeholder='Широта (центра)' value={house.lat} onChange={e => updateInputTextHouse(e, i)} />
                    </div>
                    <div className='col-xs-6'>
                        <input type='text' className='form-control' id='lng' placeholder='Долгота (центра)' value={house.lng} onChange={e => updateInputTextHouse(e, i)} />
                    </div>
                </div>
            </div>
            {house.coordinates.map((latLong, j) => {
                return <div className='form-group' key={'house_' + i + '_' + j}>
                    <div className='col-xs-6'>
                        <input type='text' className='form-control' id='lat' placeholder='Широта' value={latLong.lat} onChange={e => onUpdateInputTextPoint(e, i, j)} />
                    </div>
                    <div className='col-xs-6'>
                        <input type='text' className='form-control' id='lng' placeholder='Долгота' value={latLong.lng} onChange={e => onUpdateInputTextPoint(e, i, j)} />
                    </div>
                </div>
            })}
            <div className='col-xs-12'>
                <button type='button' className='btn btn-info' onClick={() => { onAddPoint(i); }}><span className='glyphicon glyphicon-plus-sign'></span></button>
                &nbsp;
                <button type='button' className='btn btn-danger' onClick={() => { onRemovePoint(i); }}><span className='glyphicon glyphicon-minus-sign'></span></button>
            </div>
        </div>
    }
}
