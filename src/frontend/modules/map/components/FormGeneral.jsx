import React from 'react';
import Dropzone from 'react-dropzone';
import { cleanObj } from '../../../common/utils/helper';
// Styles
import styles from './FormGeneral.scss';

export default class FormGeneral extends React.Component {

    constructor() {
        super();

        this.state = {
            show: true,
            changed: false,
            errors: [],

            name: undefined,
            description: undefined,
            step: undefined,
            site: undefined,
            camera: undefined,
            photo: undefined,
            address: undefined,
            coordinates: {
                lat: '',
                lng: ''
            },
            location: 'inner_msc',
            logo: undefined,
            image: undefined
        }

        this.timeout = null;
    }

    componentWillMount() {
        if (this.props.place) {
            let place = { ...this.props.place };
            place = cleanObj(place);

            let obj = Object.assign({}, this.state, place);
            this.setState({ ...obj });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.place) {
            if (!this.props.place || (!newProps.fetching && this.props.fetching)) {
                let place = { ...newProps.place };
                place = cleanObj(place);
    
                let obj = Object.assign({}, this.state, place);
                this.setState({ ...obj });
            } else {
                this.setState({ coordinates: { ...newProps.place.coordinates } });
            }
        }
    }

    show() {
        this.setState({ show: !this.state.show });
    }

    onUpdateInputText(e) {
        if (e.target.id == 'coordinates-lat') {
            this.props.setPlaceCenter(this.props.place._id, {
                lat: parseFloat(e.target.value),
                lng: this.state.coordinates.lng,
            });
        } else if (e.target.id == 'coordinates-lng') {
            this.props.setPlaceCenter(this.props.place._id,  {
                lat: this.state.coordinates.lat,
                lng: parseFloat(e.target.value),
            });
        } else if (e.target.id == 'address') {
            clearTimeout(this.timeout);
            this.timeout = setTimeout((context, address) => {
                let geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == 'OK') {
                        if (results.length > 0) {
                            context.props.setPlaceCenter(context.props.place._id,  {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng(),
                            });
                        }
                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }, 1500, this, e.target.value);
        } else {
            let variable = {};
            variable[e.target.id] = e.target.value;
            this.setState({ ...variable, changed: true });
        }
    }

    onRemoveImage(e) {
        let upd = {};
        upd[e.target.id] = null;

        this.setState({ ...upd});
    }

    onDropLogo(files) {
        this.setState({ logo: files[0] });
    }

    onDropImage(files) {
        this.setState({ image: files[0] });
    }

    onSave() {
        if (this.validate()) {
            this.setState({ changed: false })
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
            errors.push('Координаты не могут быть пустыми');
        }

        this.setState({ errors, changed: false });
        return errors.length == 0;
    }

    update() {
        let data = { ...this.state };
        data._id = this.state._id;

        console.log(data);

        this.props.updatePlace(data);
    }

    add() {
        let data = { ...this.state };
        delete data.errors;

        this.props.addPlace(data);
    }

    render() {
        // const { place } = this.props;
        console.log('RENDER <FormGeneral>');

        let image = null;
        if (this.state.image && typeof this.state.image === 'object') {
            image = <li>
                {this.state.image.name} - {this.state.image.size} bytes&nbsp;
                <span id='image' onClick={(e) => { this.onRemoveImage(e); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        } else if (this.state.image) {
            image = <li>
                <a href={this.state.image} target='_blank'>{this.state.image}</a>&nbsp;
                <span id='image' onClick={(e) => { this.onRemoveImage(e); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        }

        let logo = null;
        if (this.state.logo && typeof this.state.logo === 'object') {
            logo = <li>
                {this.state.logo.name} - {this.state.logo.size} bytes&nbsp;
                <span id='logo' onClick={(e) => { this.onRemoveImage(e); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        } else if (this.state.logo) {
            logo = <li>
                <a href={this.state.logo} target='_blank'>{this.state.logo}</a>&nbsp;
                <span id='logo' onClick={(e) => { this.onRemoveImage(e); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        }

        const iconCollapse = this.state.show ? <span className='glyphicon glyphicon-chevron-up'></span> : <span className='glyphicon glyphicon-chevron-down'></span>;

        return <div className={'row ' + (this.state.show ? styles.show : styles.hidden)}>
            <div className='col-xs-12' onClick={() => { this.show(); }}>
                <h5 className={styles.title}>{iconCollapse} Общие сведения {this.state.changed ? '(есть несохраненные изменения)' : ''}</h5>
            </div>
            <div className={styles.toHide}>
                <div className='form-group col-sm-4 col-md-4 '>
                    <label htmlFor='name'>Название*</label>
                    <input type='text' className='form-control' id='name' placeholder='Название' value={this.state.name} onChange={e => this.onUpdateInputText(e)} />
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='description'>Описание</label>
                    <input type='text' className='form-control' id='description' placeholder='Описание' value={this.state.description} onChange={e => this.onUpdateInputText(e)} />
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='step'>Шаг строительства</label>
                    <input type='text' className='form-control' id='step' placeholder='Шаг строительства' value={this.state.step} onChange={e => this.onUpdateInputText(e)} />
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='site'>Коммерческий сайт</label>
                    <input type='text' className='form-control' id='site' placeholder='http://site.ru' value={this.state.site} onChange={e => this.onUpdateInputText(e)} />
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='address'>Адрес*</label>
                    <input type='text' className='form-control' id='address' placeholder='Адрес' value={this.state.address} onChange={e => this.onUpdateInputText(e)} />
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='location'>Локация</label>
                    <select id='location' className='form-control' value={this.state.location} onChange={e => this.onUpdateInputText(e)}>
                        <option value='inner_msc'>Москва</option>
                        <option value='out_msc'>Московская обл</option>
                        <option value='office'>Офисы</option>
                    </select>
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='camera'>Камера</label>
                    <input type='text' className='form-control' id='camera' placeholder='Ссылка на трансляцию' value={this.state.camera} onChange={e => this.onUpdateInputText(e)} />
                </div>
                <div className='form-group col-sm-4 col-md-4'>
                    <label htmlFor='photo'>Фото галлерея</label>
                    <input type='text' className='form-control' id='photo' placeholder='Ссылка на фото галлерею' value={this.state.photo} onChange={e => this.onUpdateInputText(e)} />
                </div>
                
                <div className='form-group col-sm-4 col-md-4'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <label htmlFor='coordinates-lat'>Координаты лого*</label>
                            <input type='text' className='form-control' id='coordinates-lat' placeholder='Широта' value={this.state.coordinates.lat} onChange={e => this.onUpdateInputText(e)} />
                        </div>
                        <div className='col-xs-6'>
                            <label htmlFor='coordinates-lat'>&nbsp;</label>
                            <input type='text' className='form-control' id='coordinates-lng' placeholder='Долгота' value={this.state.coordinates.lng} onChange={e => this.onUpdateInputText(e)} />
                        </div>
                    </div>
                </div>
                
                <div className='form-group col-sm-6 col-md-6'>
                    <label>Лого*</label>
                    <Dropzone
                        className={styles.dropzone}
                        onDrop={(files) => { this.onDropLogo(files) }}
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
                    <br/>
                    <ul>
                        {logo}
                    </ul>
                </div>
                <div className='form-group col-sm-6 col-md-6'>
                    <label>Фото объекта</label>
                    <Dropzone
                        className={styles.dropzone}
                        onDrop={(files) => { this.onDropImage(files) }}
                        multiple={false}
                    >
                        {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                            if (isDragActive) {
                                return 'Данный тип файлов разрешен';
                            }
                            if (isDragReject) {
                                return 'Данный тип файлов запрещен';
                            }
                            return acceptedFiles.length || rejectedFiles.length
                                ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                                : 'Загрузите Фото объекта';
                        }}
                    </Dropzone>
                    <br/>
                    <ul>
                        {image}
                    </ul>
                </div>
                <div className='form-group col-sm-12 col-md-12'>
                    <ul className={styles.errors}>
                        {this.state.errors.map(error => <li>{error}</li>)}
                    </ul>
                    <button type='button' className='btn btn-success' onClick={() => { this.onSave(); }}>Сохранить</button>
                </div>
            </div>
        </div>
    }
}