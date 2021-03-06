import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';
import Dropzone from 'react-dropzone';
import browserHistory from 'react-router/lib/browserHistory';
// Styles
import styles from './Form.scss';

const defaultHouse = {
    name: '',
    status: '',
    style: null,
    type: 'house',
    coordinates: []
};

export default class Form extends React.Component {

    constructor() {
        super();

        this.state = {
            name: '',
            description: '',
            step: '',
            site: '',
            camera: '',
            photo: '',
            houses: [],
            address: '',
            coordinates: {
                lat: '',
                lng: ''
            },
            location: 'inner_msc',
            logo: null,
            image: null,
            hidden: false,
            errors: []
        }

        this.onDropLogo = this.onDropLogo.bind(this);
        this.onDropImage = this.onDropImage.bind(this);
        this.onUpdateInputText = this.onUpdateInputText.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onAddHouse = this.onAddHouse.bind(this);
        this.onRemoveHouse = this.onRemoveHouse.bind(this);
        this.onAddPoint = this.onAddPoint.bind(this);
        this.onRemovePoint = this.onRemovePoint.bind(this);
        this.onUpdateInputTextPoint = this.onUpdateInputTextPoint.bind(this);
        this.onRemoveImage = this.onRemoveImage.bind(this);
        this.updateCoordinatesByString = this.updateCoordinatesByString.bind(this);
        this.timeout = null;
    }

    componentWillMount() {
        if (this.props.place) {
            let place = { ...this.props.place };
            place = this.cleanObj(place);
            place.houses = place.houses ? place.houses.map(house => Object.assign({}, { ...defaultHouse }, this.cleanObj(house))) : [];

            let obj = Object.assign({}, this.state, place);
            this.props.setPolygons(obj.houses);
            this.setState({ ...obj });
        }
        if (this.props.mapStyles.length > 0 && this.props.mapStyles.length == 0) {
            defaultHouse.style = this.props.mapStyles[0];
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.marker) {
            this.setState({ coordinates: newProps.marker });
        }
        if (newProps.mapStyles.length > 0 && this.props.mapStyles.length == 0) {
            defaultHouse.style = newProps.mapStyles[0];
        }
        if (newProps.place && !this.props.place) {
            let place = { ...newProps.place };
            place = this.cleanObj(place);
            place.houses = place.houses ? place.houses.map(house => Object.assign({}, { ...defaultHouse }, this.cleanObj(house))) : [];

            let obj = Object.assign({}, this.state, place);
            this.props.setPolygons(obj.houses);
            this.setState({ ...obj });
        }
    }

    cleanObj(object) {
        for (var key in object) {
            if (object[key] == '' || !object[key]) {
                delete object[key];
            }
        }
        return object;
    }

    onRemoveImage(e) {
        let upd = {};
        upd[e.target.id] = null;
        this.setState(upd);
    }

    onDropLogo(files) {
        this.setState({
            logo: files[0]
        });
    }

    onDropImage(files) {
        this.setState({
            image: files[0]
        });
    }

    onUpdateInputText(e) {
        let variable = {};
        if (e.target.id == 'coordinates-lat') {
            variable.coordinates = {
                lat: parseFloat(e.target.value),
                lng: this.state.coordinates.lng,
            };
            this.props.setMarker(variable.coordinates);
        } else if (e.target.id == 'coordinates-lng') {
            variable.coordinates = {
                lat: this.state.coordinates.lat,
                lng: parseFloat(e.target.value),
            };
            this.props.setMarker(variable.coordinates);
        } else if (e.target.id == 'address') {
            clearTimeout(this.timeout);
            this.timeout = setTimeout((context, address) => {
                let geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == 'OK') {
                        console.log(results);
                        if (results.length > 0) {
                            let variable = {};
                            let cr = {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng(),
                            };
                            variable.coordinates = cr;
                            context.setState(variable);
                            context.props.setMarker(cr);
                        }
                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }, 1500, this, e.target.value);
            variable[e.target.id] = e.target.value;
        } else {
            variable[e.target.id] = e.target.value;
        }
        this.setState(variable);
    }

    updateCoordinatesByString(e, house_index) {
        //55,755831, 37,617673; 55,755831, 37,617673; 55,755831, 37,617673; 55,755831, 37,617673
        let houses = [...this.state.houses];
        let coords = this.refs.coorStr.value;
        if (coords == '') {
            return false;
        }
        let coordA = coords.split('; ');
        coordA.forEach(coord => {
            let coordLL = coord.split(', ');
            if (coordLL[0] && coordLL[1] && coordLL[0] != '' && coordLL[1] != '') {
                houses[house_index].coordinates.push({
                    lat: parseFloat(coordLL[0].replace(',', '.')), 
                    lng: parseFloat(coordLL[1].replace(',', '.'))
                });
            }
        });

        houses = this.trimHouses(houses, false);
        this.props.setPolygons(houses);
        this.refs.coorStr.value = '';
        this.setState({ houses });
    }
    
    onUpdateInputTextPoint(e, house_index, point_index) {
        let houses = [...this.state.houses];
        houses[house_index].coordinates[point_index][e.target.id] = parseFloat(e.target.value);

        this.props.setPolygons(houses);

        this.setState({ houses });
    }

    updateInputTextHouse(e, house_index) {
        let houses = [...this.state.houses];
        houses[house_index][e.target.id] = e.target.value;

        this.props.setPolygons(houses);
        this.setState({ houses });
    }

    onHide() {
        this.setState({hidden: !this.state.hidden});
    }

    onSave() {
        if (this.validate()) {
            if (this.props.place) {
                this.update();
            } else {
                this.add();
            }
        }
    }

    validate() {
        let errors = [];
        if (!this.state.name) {
            errors.push('Название не может быть пустым');
        }
        if (!this.state.logo) {
            errors.push('Лого не может быть пустым');
        }
        if (!this.state.coordinates.lat || !this.state.coordinates.lng) {
            errors.push('Координаты не можгут быть пустыми');
        }

        this.setState({ errors });
        return errors.length == 0;
    }

    update() {
        let data = { ...this.state };
        delete data.errors;
        data = this.prepareHouses(data);

        console.log(data);
        this.props.updatePlace(data);
        browserHistory.push('/map');
    }

    add() {
        let data = { ...this.state };
        delete data.errors;
        data = this.prepareHouses(data);

        this.props.addPlace(data);
        browserHistory.push('/map');
    }

    prepareHouses(data) {
        let state = { ...data };
        state.houses = this.trimHouses(state.houses, true);
        return state;
    }

    trimHouses(houses, name_mand = true) {
        return houses.filter(house => {
            if ((house.name || name_mand === false) && house.coordinates.length > 0) {
                house.coordinates = house.coordinates.filter(coordinate => {
                    if (coordinate.lat && coordinate.lng &&
                        coordinate.lat != '' && coordinate.lng != '') {
                        return true;
                    }
                    return false;
                });
                return true;
            }
            return false;
        });
    }

    onAddHouse() {
        let houses = [...this.state.houses];
        let newHouse = { ...defaultHouse };
        newHouse.coordinates = [
            {
                lat: '',
                lng: ''
            }
        ]
        houses.push(newHouse);

        this.setState({ houses });
    }

    onRemoveHouse(house_index) {
        let houses = [...this.state.houses];

        houses.splice(house_index, 1);
        this.setState({ houses });
        this.props.setPolygons(houses);
    }

    onAddPoint(house_index) {
        let houses = [...this.state.houses];
        houses[house_index].coordinates.push({
            lat: '',
            lng: ''
        });
        this.setState({ houses });
    }

    onRemovePoint(house_index) {
        let houses = [...this.state.houses];
        let coordinates = [...houses[house_index].coordinates];

        coordinates.splice(coordinates.length - 1, 1);
        houses[house_index].coordinates = coordinates;

        this.setState({ houses });
        this.props.setPolygons(houses);
    }

    render() {
        const { place, mapStyles } = this.props;
        console.log('RENDER <Form>');

        let title = 'Добавить новый проект';
        if (place) {
            title = 'Редактирование';
        }

        let image = null;
        if (this.state.image && typeof this.state.image === 'object') {
            image = <li>
                {this.state.image.name} - {this.state.image.size} bytes&nbsp;
                <span id='image' onClick={this.onRemoveImage} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        } else if (this.state.image) {
            image = <li>
                <a href={this.state.image} target='_blank'>{this.state.image}</a>&nbsp;
                <span id='image' onClick={this.onRemoveImage} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        }

        let logo = null;
        if (this.state.logo && typeof this.state.logo === 'object') {
            logo = <li>
                {this.state.logo.name} - {this.state.logo.size} bytes&nbsp;
                <span id='logo' onClick={this.onRemoveImage} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        } else if (this.state.logo) {
            logo = <li>
                <a href={this.state.logo} target='_blank'>{this.state.logo}</a>&nbsp;
                <span id='logo' onClick={this.onRemoveImage} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        }
        let hiddenClass = this.state.hidden ? styles.hiddenForm : '';
        let hiddenBtn = this.state.hidden ? 'glyphicon-chevron-right' : 'glyphicon-chevron-left';

        return <div className={'col-sm-4 col-md-3 sidebar ' + styles.add + ' ' + hiddenClass}>
            <div className='row'>
                <h1>
                    {title} 
                    <span className={'glyphicon ' + hiddenBtn + ' ' + styles.btn} onClick={this.onHide}></span>
                    <span title='Сохранить' onClick={this.onSave} className={'glyphicon glyphicon-floppy-save ' + styles.btn}></span>
                </h1>
                <div className={styles.scrolWrapper}>
                    <form>
                        <div className='col-sm-12 col-md-12'>
                            <div className='form-group'>
                                <label htmlFor='name'>Название*</label>
                                <input type='text' className='form-control' id='name' placeholder='Название' value={this.state.name} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='description'>Описание</label>
                                <input type='text' className='form-control' id='description' placeholder='Описание' value={this.state.description} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='step'>Шаг строительства</label>
                                <input type='text' className='form-control' id='step' placeholder='Шаг строительства' value={this.state.step} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='site'>Коммерческий сайт</label>
                                <input type='text' className='form-control' id='site' placeholder='http://site.ru' value={this.state.site} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='camera'>Камера</label>
                                <input type='text' className='form-control' id='camera' placeholder='Ссылка на трансляцию' value={this.state.camera} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='photo'>Фото галлерея</label>
                                <input type='text' className='form-control' id='photo' placeholder='Ссылка на фото галлерею' value={this.state.photo} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='address'>Адрес*</label>
                                <input type='text' className='form-control' id='address' placeholder='Адрес' value={this.state.address} onChange={e => this.onUpdateInputText(e)} />
                            </div>
                            <div className='form-group row'>
                                <div className='col-xs-6'>
                                    <label htmlFor='coordinates-lat'>Координаты*</label>
                                    <input type='text' className='form-control' id='coordinates-lat' placeholder='Широта' value={this.state.coordinates.lat} onChange={e => this.onUpdateInputText(e)} />
                                </div>
                                <div className='col-xs-6'>
                                    <label htmlFor='coordinates-lat'>&nbsp;</label>
                                    <input type='text' className='form-control' id='coordinates-lng' placeholder='Долгота' value={this.state.coordinates.lng} onChange={e => this.onUpdateInputText(e)} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='location'>Локация</label>
                                <select id='location' className='form-control' value={this.state.location} onChange={e => this.onUpdateInputText(e)}>
                                    <option value='inner_msc'>Москва</option>
                                    <option value='out_msc'>Московская обл</option>
                                    <option value='office'>Офисы</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Лого*</label>
                                <ul>
                                    {logo}
                                </ul>
                                <Dropzone
                                    accept='image/png'
                                    className={styles.dropzone}
                                    onDrop={this.onDropLogo}
                                    multiple={false}
                                >
                                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                        if (isDragActive) {
                                            return 'Данный тип фалов разрешен';
                                        }
                                        if (isDragReject) {
                                            return 'Данный тип фалов запрещен';
                                        }
                                        return acceptedFiles.length || rejectedFiles.length
                                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                                            : 'Загрузите Лого объекта';
                                    }}
                                </Dropzone>
                            </div>
                            <div className='form-group'>
                                <label>Фото объекта</label>
                                <ul>
                                    {image}
                                </ul>
                                <Dropzone
                                    accept='image/png'
                                    className={styles.dropzone}
                                    onDrop={this.onDropImage}
                                    multiple={false}
                                >
                                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                        if (isDragActive) {
                                            return 'Данный тип фалов разрешен';
                                        }
                                        if (isDragReject) {
                                            return 'Данный тип фалов запрещен';
                                        }
                                        return acceptedFiles.length || rejectedFiles.length
                                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                                            : 'Загрузите Фото объекта';
                                    }}
                                </Dropzone>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='photo'>Объекты</label>
                                {this.state.houses.map((house, i) => {
                                    return <div className={'form-group row ' + styles.house} key={'house_' + i}>
                                        <div className='col-xs-12'>
                                            <button type='button' className='btn btn-danger' onClick={() => { this.onRemoveHouse(i) }}>Удалить дом</button>
                                        </div>
                                        <div className='col-xs-12'>
                                            <input type='text' className='form-control' id='name' placeholder='Навание' value={house.name} onChange={e => this.updateInputTextHouse(e, i)} />
                                        </div>
                                        <div className='col-xs-12'>
                                            <select id='style' className='form-control' value={house.style ? house.style : mapStyles.length > 0 ? mapStyles[0]._id : ''} onChange={e => this.updateInputTextHouse(e, i)}>
                                                {mapStyles.length > 0 && mapStyles.map(style => {
                                                    return <option value={style._id}>Стиль: {style.name}</option>;
                                                })}
                                            </select>
                                        </div>
                                        <div className='col-xs-12'>
                                            <input type='text' className='form-control' id='status' placeholder='Статус' value={house.status} onChange={e => this.updateInputTextHouse(e, i)} />
                                        </div>
                                        {house.type == 'camera' && <div className='col-xs-12'>
                                            <input type='text' className='form-control' id='camera' placeholder='Камера' value={house.camera} onChange={e => this.updateInputTextHouse(e, i)} />
                                        </div>}
                                        <div className='col-xs-12'>
                                            <select id='type' className='form-control' value={(house.type && house.type != '') ? house.type : 'house'} onChange={e => this.updateInputTextHouse(e, i)}>
                                                <option value='house'>Тип: Дом</option>
                                                <option value='tube'>Тип: Коммуникации</option>
                                                <option value='camera'>Тип: Камера</option>
                                            </select>
                                        </div>
                                        <div className='col-xs-12'>
                                            <input type='text' ref='coorStr' className='form-control' id='status' placeholder='Добавить координаты строкой' />
                                            <button type='button' className='btn btn-info' onClick={e => this.updateCoordinatesByString(e, i)}><span className='glyphicon glyphicon-plus-sign'></span></button>
                                        </div>
                                        {house.coordinates.map((latLong, j) => {
                                            return <div className='form-group' key={'house_' + i + '_' + j}>
                                                <div className='col-xs-6'>
                                                    <input type='text' className='form-control' id='lat' placeholder='Широта' value={latLong.lat} onChange={e => this.onUpdateInputTextPoint(e, i, j)} />
                                                </div>
                                                <div className='col-xs-6'>
                                                    <input type='text' className='form-control' id='lng' placeholder='Долгота' value={latLong.lng} onChange={e => this.onUpdateInputTextPoint(e, i, j)} />
                                                </div>
                                            </div>
                                        })}
                                        <div className='col-xs-12'>
                                            <button type='button' className='btn btn-info' onClick={() => { this.onAddPoint(i); }}><span className='glyphicon glyphicon-plus-sign'></span></button>
                                            &nbsp;
                                            <button type='button' className='btn btn-danger' onClick={() => { this.onRemovePoint(i); }}><span className='glyphicon glyphicon-minus-sign'></span></button>
                                        </div>
                                    </div>
                                })}
                                <br />
                                <button type='button' className='btn btn-info' onClick={this.onAddHouse}>Добавить дом</button>
                            </div>
                            <ul className={styles.errors}>
                                {this.state.errors.map(error => <li>{error}</li>)}
                            </ul>
                            <Link className='btn btn-default' to='/map'>Отмена</Link> <button type='button' className='btn btn-success' onClick={this.onSave}>Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

Form.propTypes = {
    marker: PropTypes.object,
    place: PropTypes.object,
    setMarker: PropTypes.func.isRequired,
    setPolygons: PropTypes.func.isRequired,
}