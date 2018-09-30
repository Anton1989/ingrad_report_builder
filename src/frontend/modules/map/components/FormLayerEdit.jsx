import React from 'react';
import Dropzone from 'react-dropzone';
// Styles
import styles from './FormPanarams.scss';

export default class FormLayerEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            placeId: props.placeId,
            name: null,
            image: null,
            opcity: null,
            coordinates: [{ lat: '', lng: '' }, { lat: '', lng: '' }]
        }

        this.timeout = null;
    }

    componentWillMount() {
        if (this.props.layer) {
            this.setState({ ...this.props.layer });
        }
    }

    onUpdateInputCooLayer(e, coordinate_index) {
        let coordinates = [ ...this.state.coordinates ];
        coordinates[coordinate_index][e.target.id] = parseFloat(e.target.value);

        // this.props.setOverlays(layers);
        this.setState({ coordinates });
    }

    updateInputText(e) {
        const state = { ...this.state };
        state[e.target.id] = e.target.value;
        
        this.setState({ ...state });
    }

    onDrop360(files) {
        this.setState({ image: files[0] });
    }

    onRemove360Image() {
        this.setState({ image: null });
    }

    onSave() {
        if (this.state._id) {
            this.props.saveLayer({ ...this.state });
        } else {
            this.props.addLayer({ ...this.state });
        }
        this.props.closeModal();
    }

    render() {
        const { closeModal } = this.props;
        console.log('RENDER <FormPanaramEdit>');

        const layer = this.state;

        let image = null;
        if (layer.image && typeof layer.image === 'object') {
            image = <li>
                {layer.image.name} - {layer.image.size} bytes&nbsp;
                <span id='image' onClick={() => { this.onRemove360Image(); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        } else if (layer.image) {
            image = <li>
                <a href={layer.image} target='_blank'>{layer.image}</a>&nbsp;
                <span id='image' onClick={() => { this.onRemove360Image(); }} className='glyphicon glyphicon-minus-sign'></span>
            </li>;
        }

        return <div className={'form-group row ' + styles.house}>
            <div className='form-group col-sm-12 col-md-12'>
                <div className='row'>
                    <div className='col-xs-6'>
                        <label htmlFor='name'>Название</label>
                        <input type='text' className='form-control' id='name' placeholder='Название' value={layer.name} onChange={e => this.updateInputText(e)} />
                    </div>
                    <div className='col-xs-6'>
                        <label htmlFor='name'>Прозрачность</label>
                        <input type='text' className='form-control' id='opcity' placeholder='Прозрачность' value={layer.opcity} onChange={e => this.updateInputText(e)} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-3'>
                        <label htmlFor='lat'>Левый нижний угол</label>
                        <input type='text' className='form-control' id='lat' placeholder='Широта' value={layer.coordinates[0].lat} onChange={e => this.onUpdateInputCooLayer(e, 0)} />
                    </div>
                    <div className='col-xs-3'>
                        <label htmlFor='lng'>&nbsp;</label>
                        <input type='text' className='form-control' id='lng' placeholder='Долгота' value={layer.coordinates[0].lng} onChange={e => this.onUpdateInputCooLayer(e, 0)} />
                    </div>
                    <div className='col-xs-3'>
                        <label htmlFor='lat'>Правый верхний угол</label>
                        <input type='text' className='form-control' id='lat' placeholder='Широта' value={layer.coordinates[1].lat} onChange={e => this.onUpdateInputCooLayer(e, 1)} />
                    </div>
                    <div className='col-xs-3'>
                        <label htmlFor='lng'>&nbsp;</label>
                        <input type='text' className='form-control' id='lng' placeholder='Долгота' value={layer.coordinates[1].lng} onChange={e => this.onUpdateInputCooLayer(e, 1)} />
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
                            : 'Загрузите слой';
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