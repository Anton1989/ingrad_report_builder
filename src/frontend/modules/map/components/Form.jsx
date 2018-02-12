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
    color: '#000000',
    type: 'house',
    coordinates: [
        {
            lat: '',
            lng: ''
        }
    ]
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
            errors: []
        }

        this.onDropLogo = this.onDropLogo.bind(this);
        this.onDropImage = this.onDropImage.bind(this);
        this.updateInputText = this.updateInputText.bind(this);
        this.add = this.add.bind(this);
        this.addHouse = this.addHouse.bind(this);
        this.removeHouse = this.removeHouse.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.updateInputTextPoint = this.updateInputTextPoint.bind(this);
        this.timeout = null;
    }

    componentWillMount() {
        if (this.props.place) {
            let place = { ...this.props.place };
            for (var key in place) {
                if (place[key] == '' || !place[key]) {
                    delete place[key];
                }
            }
            let obj = Object.assign({}, this.state, place);
            this.props.setPolygons(obj.houses);
            this.setState({ ...obj });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.marker) {
            this.setState({ coordinates: newProps.marker });
        }
        if (newProps.place && !this.props.place) {
            let place = { ...newProps.place };
            place = this.cleanObj(place);
            place.houses = place.houses.map(house => Object.assign({}, { ...defaultHouse }, this.cleanObj(house)));

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

    updateInputText(e) {
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

    updateInputTextPoint(e, house_index, point_index) {
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

    add() {
        let errors = [];
        if (!this.state.name) {
            errors.push('Название не может быть пустым');
        }
        if (!this.state.logo) {
            errors.push('Лого не может быть пустым');
        }
        if (!this.state.coordinates.lat || !this.state.coordinates.lng) {
            errors.push('Координаты не может быть пустым');
        }
        if (errors.length > 0) {
            return this.setState({ errors });
        } else {
            this.setState({ errors });
        }

        let data = { ...this.state };
        delete data.errors;
        data = this.prepareHouses(data);

        this.props.addPlace(data);
        browserHistory.push('/map');
    }

    prepareHouses(data) {
        let state = { ...data };
        state.houses = this.trimHouses(state.houses);
        return state;
    }

    trimHouses(houses) {
        return houses.filter(house => {
            if (house.name && house.coordinates.length > 0 && house.coordinates[0].lat && house.coordinates[0].lng) {
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

    addHouse() {
        let houses = [...this.state.houses];
        houses.push({ ...defaultHouse });

        this.setState({ houses });
    }

    removeHouse(house_index) {
        let houses = [...this.state.houses];

        houses.splice(house_index, 1);
        this.setState({ houses });
        this.props.setPolygons(houses);
    }

    addPoint(house_index) {
        let houses = [...this.state.houses];
        houses[house_index].coordinates.push({
            lat: '',
            lng: ''
        });
        this.setState({ houses });
    }

    removePoint(house_index) {
        let houses = [...this.state.houses];
        let coordinates = [...houses[house_index].coordinates];

        coordinates.splice(coordinates.length - 1, 1);
        houses[house_index].coordinates = coordinates;

        this.setState({ houses });
        this.props.setPolygons(houses);
    }

    render() {
        const { place } = this.props;
        console.log('RENDER <Form>');

        let title = 'Добавить новый проект';
        if (place) {
            title = 'Редактирование проекта';
        }

        return <div className={'col-sm-4 col-md-3 sidebar ' + styles.add}>
            <div className='row'>
                <h1>{title}</h1>
                <div className={styles.scrolWrapper}>
                    <form>
                        <div className='col-sm-12 col-md-12'>
                            <div className='form-group'>
                                <label htmlFor='name'>Название*</label>
                                <input type='text' className='form-control' id='name' placeholder='Название' value={this.state.name} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='description'>Описание</label>
                                <input type='text' className='form-control' id='description' placeholder='Описание' value={this.state.description} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='step'>Шаг строительства</label>
                                <input type='text' className='form-control' id='step' placeholder='Шаг строительства' value={this.state.step} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='site'>Коммерческий сайт</label>
                                <input type='text' className='form-control' id='site' placeholder='http://site.ru' value={this.state.site} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='camera'>Камера</label>
                                <input type='text' className='form-control' id='camera' placeholder='Ссылка на трансляцию' value={this.state.camera} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='photo'>Фото галлерея</label>
                                <input type='text' className='form-control' id='photo' placeholder='Ссылка на фото галлерею' value={this.state.photo} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='photo'>Дома</label>
                                {this.state.houses.map((house, i) => {
                                    return <div className={'form-group row ' + styles.house} key={'house_' + i}>
                                        <div className='col-xs-12'>
                                            <button type='button' className='btn btn-danger' onClick={() => { this.removeHouse(i) }}>Удалить дом</button>
                                        </div>
                                        <div className='col-xs-12'>
                                            <input type='text' className='form-control' id='name' placeholder='Навание' value={house.name} onChange={e => this.updateInputTextHouse(e, i)} />
                                        </div>
                                        <div className='col-xs-12'>
                                            <input type='text' className='form-control' id='color' placeholder='Цвет (#000000)' value={house.color} onChange={e => this.updateInputTextHouse(e, i)} />
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
                                        {house.coordinates.map((latLong, j) => {
                                            return <div className='form-group' key={'house_' + i + '_' + j}>
                                                <div className='col-xs-6'>
                                                    <input type='text' className='form-control' id='lat' placeholder='Широта' value={latLong.lat} onChange={e => this.updateInputTextPoint(e, i, j)} />
                                                </div>
                                                <div className='col-xs-6'>
                                                    <input type='text' className='form-control' id='lng' placeholder='Долгота' value={latLong.lng} onChange={e => this.updateInputTextPoint(e, i, j)} />
                                                </div>
                                            </div>
                                        })}
                                        <div className='col-xs-12'>
                                            <button type='button' className='btn btn-info' onClick={() => { this.addPoint(i); }}><span className='glyphicon glyphicon-plus-sign'></span></button>
                                            &nbsp;
                                            <button type='button' className='btn btn-danger' onClick={() => { this.removePoint(i); }}><span className='glyphicon glyphicon-minus-sign'></span></button>
                                        </div>
                                    </div>
                                })}
                                <br />
                                <button type='button' className='btn btn-info' onClick={this.addHouse}>Добавить дом</button>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='address'>Адрес*</label>
                                <input type='text' className='form-control' id='address' placeholder='Адрес' value={this.state.address} onChange={e => this.updateInputText(e)} />
                            </div>
                            <div className='form-group row'>
                                <div className='col-xs-6'>
                                    <label htmlFor='coordinates-lat'>Координаты*</label>
                                    <input type='text' className='form-control' id='coordinates-lat' placeholder='Широта' value={this.state.coordinates.lat} onChange={e => this.updateInputText(e)} />
                                </div>
                                <div className='col-xs-6'>
                                    <label htmlFor='coordinates-lat'>&nbsp;</label>
                                    <input type='text' className='form-control' id='coordinates-lng' placeholder='Долгота' value={this.state.coordinates.lng} onChange={e => this.updateInputText(e)} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='location'>Локация</label>
                                <select id='location' className='form-control' value={this.state.location} onChange={e => this.updateInputText(e)}>
                                    <option value='inner_msc'>Москва</option>
                                    <option value='out_msc'>Московская обл</option>
                                    <option value='office'>Офисы</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Лого*</label>
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
                            <ul className={styles.errors}>
                                {this.state.errors.map(error => <li>{error}</li>)}
                            </ul>
                            <Link className='btn btn-default' to='/map'>Отмена</Link> <button type='button' className='btn btn-success' onClick={this.add}>Сохранить</button>
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