import React from 'react';
import FormGeneral from './FormGeneral.jsx';
import FormPanarams from './FormPanarams.jsx';
import FormLayers from './FormLayers.jsx';
import FormBuild from './FormBuild.jsx';
import { cleanObj } from '../../../common/utils/helper';
// Styles
import styles from './Form.scss';

const defaultHouse = {
    name: '',
    status: '',
    style: null,
    ugol: '0',
    lat: '', 
    lng: '',
    type: 'house',
    coordinates: []
};

const defaultLayer = {
    name: '',
    image: null,
    show: false,
    opcity: 1,
    coordinates: []
};

export default class Form extends React.Component {

    constructor() {
        super();

        this.state = {
            layers: [],
            houses: [],
            hidden: false,
            toUpdate: {}
        }

        this.onAddHouse = this.onAddHouse.bind(this);
        this.onAddLayer = this.onAddLayer.bind(this);
        this.onRemoveHouse = this.onRemoveHouse.bind(this);
        this.onUpdateInputTextLayer = this.onUpdateInputTextLayer.bind(this);
    }

    componentWillMount() {
        if (this.props.place) {
            let place = { ...this.props.place };
            place = cleanObj(place);
            place.houses = place.houses ? place.houses.map(house => Object.assign({}, { ...defaultHouse }, cleanObj(house))) : [];

            let obj = Object.assign({}, this.state, place);
            this.props.setPolygons(obj.houses);
            this.setState({ ...obj });
        }
        if (this.props.mapStyles.length > 0 && this.props.mapStyles.length == 0) {
            defaultHouse.style = this.props.mapStyles[0];
        }
    }

    componentWillUpdate(props, state) {
        if (state.houses != this.state.houses || (props.mapStyles.length > 0 && this.props.mapStyles.length == 0)) {
            console.log('setPolygons on MAP');
            this.props.setPolygons(state.houses);
        }
    }

    componentWillReceiveProps(newProps) {
        const toUpdate = { ...this.state.toUpdate };
        if (newProps.marker) {
            toUpdate.coordinates = newProps.marker;
            this.setState({ coordinates: newProps.marker });
        }
        if (newProps.updateHouse) {
            const houses = [ ...this.state.houses ];
            houses[newProps.updateHouse.index].lat = newProps.updateHouse.coordinates.lat;
            houses[newProps.updateHouse.index].lng = newProps.updateHouse.coordinates.lng;
            toUpdate.houses = houses;
        }
        this.setState({ toUpdate });
        if (newProps.mapStyles.length > 0 && this.props.mapStyles.length == 0) {
            defaultHouse.style = newProps.mapStyles[0];
            this.props.setPolygons(this.state.houses);
        }
        if (newProps.place && !this.props.place) {
            let place = { ...newProps.place };
            place = cleanObj(place);
            place.houses = place.houses ? place.houses.map(house => Object.assign({}, { ...defaultHouse }, cleanObj(house))) : [];

            let obj = Object.assign({}, this.state, place);
            this.setState({ ...obj });
            // this.props.setPolygons(place.houses);
        }
    }

    prepareHouses(data) {
        let state = { ...data };
        if (state.houses && state.houses.length > 0) {
            state.houses = this.trimHouses(state.houses, true);
        }
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

    onAddLayer() {
        let layers = [...this.state.layers];
        let newLayer = { ...defaultLayer };
        newLayer.coordinates = [{ lat: '', lng: '' }, { lat: '', lng: '' }];
        layers.push(newLayer);

        this.setState({ layers });
    }

    onRemoveLayer(layer_index) {
        let layers = [...this.state.layers];
        const toUpdate = { ...this.state.toUpdate };

        layers.splice(layer_index, 1);
        toUpdate.layers = layers;
        this.setState({ layers, toUpdate });
        this.props.setOverlays(layers);
    }

    showLayer(layer_index) {
        let layers = [...this.state.layers];
        const toUpdate = { ...this.state.toUpdate };

        layers[layer_index].show = !layers[layer_index].show;
        toUpdate.layers = layers;
        this.setState({ layers, toUpdate });
        this.props.setOverlays(layers);
    }

    onUpdateInputTextLayer(e, layer_index) {
        let layers = [...this.state.layers];
        const toUpdate = { ...this.state.toUpdate };
        layers[layer_index][e.target.id] = e.target.value;

        toUpdate.layers = layers;
        this.props.setOverlays(layers);
        this.setState({ layers, toUpdate });
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
        const toUpdate = { ...this.state.toUpdate };

        houses.splice(house_index, 1);
        toUpdate.houses = houses;
        this.setState({ houses, toUpdate });
    }

    render() {
        const { place, panarams, layers, builds, saveBuild, addBuild, showOnMap, toShowLayers, getDetails, addLayer, saveLayer, deleteLayer, deleteBuild, mapStyles, setPlaceCenter, addPanorame, savePanorame, deletePanaram, updatePlace, fetching, detailFetching } = this.props;
        console.log('RENDER <Form>');

        let title = 'Добавить новый проект';
        if (place) {
            title = 'Редактирование';
        }

        return <div className={'col-sm-12 col-md-12 ' + styles.add}>
            <div className='row'>
                <h1>
                    {title}
                    <span title='Сохранить' onClick={this.onSave} className={'glyphicon glyphicon-floppy-save ' + styles.btn}></span>
                </h1>
                <div className={styles.scrolWrapper}>
                    <form>
                        <FormGeneral place={place} fetching={fetching} setPlaceCenter={setPlaceCenter} updatePlace={updatePlace} />
                        {place && <FormPanarams placeId={place._id} panarams={panarams} deletePanaram={deletePanaram} detailFetching={detailFetching} getDetails={getDetails} addPanorame={addPanorame} savePanorame={savePanorame} />}
                        {place && <FormLayers placeId={place._id} showOnMap={showOnMap} toShowLayers={toShowLayers} layers={layers} deleteLayer={deleteLayer} detailFetching={detailFetching} addLayer={addLayer} saveLayer={saveLayer} />}
                        {place && <FormBuild mapStyles={mapStyles} placeId={place._id} builds={builds} delete={deleteBuild} detailFetching={detailFetching} add={addBuild} save={saveBuild} />}
                    </form>
                </div>
            </div>
        </div>
    }
}