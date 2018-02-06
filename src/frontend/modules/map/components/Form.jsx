import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';
import Dropzone from 'react-dropzone';
// Styles
import styles from './Form.scss';

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
            address: '',
            coordinates: {
                lat: '',
                lng: ''
            },
            location: '',
            logo: null,
            image: null,
            errors: []
        }

        this.onDropLogo = this.onDropLogo.bind(this);
        this.onDropImage = this.onDropImage.bind(this);
        this.updateInputText = this.updateInputText.bind(this);
        this.add = this.add.bind(this);
    }

    onDropLogo(files) {
        console.log(files)
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
                lat: e.target.value,
                lng: this.state.coordinates.lng,
            };
        } else if (e.target.id == 'coordinates-lng') {
            variable.coordinates = {
                lat: this.state.coordinates.lat,
                lng: e.target.value,
            };
        } else {
            variable[e.target.id] = e.target.value;
        }
        this.setState(variable);
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
        }

        // TODO
    }

    render() {
        console.log('RENDER <Form>');

        return <div className={'col-sm-4 col-md-3 sidebar ' + styles.add}>
            <div className='row'>
                <h1>Добавить новый проект</h1>
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
                                <label>Лого</label>
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
                            <Link className='btn btn-default' to='/map'>Отмена</Link> <button type='button' className='btn btn-success' onClick={this.add}>Добавить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

Form.propTypes = {
    place: PropTypes.object//.isRequired
}