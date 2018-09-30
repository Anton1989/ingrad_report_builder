import React from 'react';
import Dropzone from 'react-dropzone';
// Styles
import styles from './FormPanarams.scss';

export default class FormPanaramEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            src: null,
            placeId: props.placeId,
            coordinates: { lat: '', lng: '' }
        }

        this.timeout = null;
    }

    componentWillMount() {
        if (this.props.panaram) {
            this.setState({ ...this.props.panaram });
        }
    }

    updateCoordinates360(e) {
        let coordinates = { ...this.state.coordinates };

        if (e.target.id == 'coordinates-lat') {
            coordinates.lat = parseFloat(e.target.value);
        } else if (e.target.id == 'coordinates-lng') {
            coordinates.lng = parseFloat(e.target.value);
        }
        this.setState({ coordinates });
    }

    updateInputText360(e) {
        const state = { ...this.state };
        state[e.target.id] = e.target.value;
        
        this.setState({ ...state });
    }

    onDrop360(files) {
        this.setState({ src: files[0] });
    }

    onRemove360Image() {
        this.setState({ src: null });
    }

    onSave() {
        if (this.state._id) {
            this.props.savePanorame({ ...this.state });
        } else {
            this.props.addPanorame({ ...this.state });
        }
        this.props.closeModal();
    }

    render() {
        const { closeModal } = this.props;
        console.log('RENDER <FormPanaramEdit>');

        const img360 = this.state;

        let image = null;
        if (img360.src && typeof img360.src === 'object') {
            image = <li>
                {img360.src.name} - {img360.src.size} bytes&nbsp;
                <span id='image' onClick={() => { this.onRemove360Image(); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        } else if (img360.src) {
            image = <li>
                <a href={img360.src} target='_blank'>{img360.src}</a>&nbsp;
                <span id='image' onClick={() => { this.onRemove360Image(); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        }

        return <div className={'form-group row ' + styles.house}>
            <div className='form-group col-sm-12 col-md-12'>
                <div className='row'>
                    <div className='col-xs-4'>
                        <label htmlFor='name'>Название</label>
                        <input type='text' className='form-control' id='name' placeholder='Название' value={img360.name} onChange={e => this.updateInputText360(e)} />
                    </div>
                    <div className='col-xs-4'>
                        <label htmlFor='coordinates-lat'>Координаты*</label>
                        <input type='text' className='form-control' id='coordinates-lat' placeholder='Широта' value={img360.coordinates.lat} onChange={e => this.updateCoordinates360(e)} />
                    </div>
                    <div className='col-xs-4'>
                        <label htmlFor='coordinates-lat'>&nbsp;</label>
                        <input type='text' className='form-control' id='coordinates-lng' placeholder='Долгота' value={img360.coordinates.lng} onChange={e => this.updateCoordinates360(e)} />
                    </div>
                </div>
            </div>
            <div className='form-group col-sm-12 col-md-12'>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={(files) => { this.onDrop360(files); }}
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
                            : 'Загрузите фото 360';
                    }}
                </Dropzone>
                <ul>
                    {image}
                </ul>
            </div>
            <div className='form-group col-sm-12 col-md-12'>
                <button type='button' className='btn btn-success' onClick={() => { this.onSave(); }}>{this.state._id ? 'Сохранить' : 'Добавить'}</button>
                &nbsp;
                <button type='button' className='btn btn-default' onClick={() => { closeModal(); }}>Отмена</button>
            </div>
        </div>
    }
}