import React from 'react';
import Objects from './Objects.jsx';
import Camera from './Camera.jsx';
// Styles
import styles from './FormPanarams.scss';

export default class FormBuildEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            placeId: props.placeId,
            name: '',
            status: '',
            style: null,
            ugol: '0',
            lat: '', 
            lng: '',
            type: 'house',
            coordinates: []
        }

        this.timeout = null;
        this.updateInputTextHouse = this.updateInputTextHouse.bind(this);
        this.onUpdateInputTextPoint = this.onUpdateInputTextPoint.bind(this);
        this.updateCoordinatesByString = this.updateCoordinatesByString.bind(this);
    }

    componentWillMount() {
        if (this.props.build) {
            this.setState({ ...this.props.build });
        }
    }

    onUpdateInputCooLayer(e, coordinate_index) {
        let coordinates = [ ...this.state.coordinates ];
        coordinates[coordinate_index][e.target.id] = parseFloat(e.target.value);

        // this.props.setOverlays(layers);
        this.setState({ coordinates });
    }

    updateInputTextHouse(e) {
        let house = {...this.state };
        house[e.target.id] = e.target.value;
        this.setState({ ...house });
    }

    onUpdateInputTextPoint(e, point_index) {
        let coordinates = [...this.state.coordinates];
        if (!coordinates[point_index]) {
            coordinates[point_index] = {
                lat: '', 
                lng: ''
            }
        }
        coordinates[point_index][e.target.id] = parseFloat(e.target.value);

        this.setState({ coordinates });
    }

    updateInputText(e) {
        const state = { ...this.state };
        state[e.target.id] = e.target.value;
        
        this.setState({ ...state });
    }

    onAddPoint() {
        let house = { ...this.state };
        house.coordinates.push({
            lat: '',
            lng: ''
        });
        this.setState({ ...house });
    }

    updateCoordinatesByString(coords) {
        //55,755831, 37,617673; 55,755831, 37,617673; 55,755831, 37,617673; 55,755831, 37,617673
        let coordinates = [...this.state.coordinates];
        if (coords == '') {
            return false;
        }
        let coordA = coords.value.trim().split(';');
        console.log(coordA)
        coordA.forEach(coord => {
            let coordLL = coord.split(',');
            if (coordLL[0] && coordLL[1] && coordLL[0] != '' && coordLL[1] != '') {
                coordinates.push({
                    lat: parseFloat(coordLL[0].replace(',', '.')),
                    lng: parseFloat(coordLL[1].replace(',', '.'))
                });
            }
        });

        coords.value = '';
        this.setState({ coordinates });
    }

    onRemovePoint() {
        let coordinates = [...this.state.coordinates];
        coordinates.splice(coordinates.length - 1, 1);
        this.setState({ coordinates });
    }

    onDrop360(files) {
        this.setState({ image: files[0] });
    }

    onRemove360Image() {
        this.setState({ image: null });
    }

    onSave() {
        if (this.state._id) {
            this.props.save({ ...this.state });
        } else {
            this.props.add({ ...this.state });
        }
        this.props.closeModal();
    }

    render() {
        const { closeModal, mapStyles } = this.props;
        console.log('RENDER <FormPanaramEdit>');

        const build = this.state;
        let buildHtml = null;

        if (build.type == 'camera') {
            buildHtml = <Camera house={build}
                mapStyles={mapStyles}
                updateInputTextHouse={this.updateInputTextHouse} 
                onUpdateInputTextPoint={this.onUpdateInputTextPoint} />;
        } else {
            buildHtml = <Objects house={build}
                mapStyles={mapStyles}
                updateInputTextHouse={this.updateInputTextHouse} 
                updateCoordinatesByString={this.updateCoordinatesByString} 
                onUpdateInputTextPoint={this.onUpdateInputTextPoint} 
                onRemovePoint={() => { this.onRemovePoint(); }} 
                onAddPoint={() => { this.onAddPoint(); }} />;
        }

        return <div className={'form-group ' + styles.house}>
            {buildHtml}
            <div className={'form-group row ' + styles.house}>
                <div className='form-group col-sm-12 col-md-12'>
                    <button type='button' className='btn btn-success' onClick={() => { this.onSave(); }}>{this.state._id ? 'Сохранить' : 'Добавить'}</button>
                    &nbsp;
                    <button type='button' className='btn btn-default' onClick={() => { closeModal(); }}>Отмена</button>
                </div>
            </div>
        </div>
    }
}