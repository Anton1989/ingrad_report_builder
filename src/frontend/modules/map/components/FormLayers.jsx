import React from 'react';
import Modal from '../../../common/components/Modal.jsx';
import FormLayerEdit from './FormLayerEdit.jsx';
// Styles
import styles from './FormPanarams.scss';

export default class FormLayers extends React.Component {

    constructor() {
        super();

        this.state = {
            showBlock: false,
            showModal: false,
            layer: null,
        }

        this.close = this.close.bind(this);
    }

    // componentWillMount() {
    //     if (this.props.placeId && this.props.panarams === undefined && !this.props.detailFetching) {
    //         this.props.getDetails(this.props.placeId);
    //     }
    // }

    close() {
        this.setState({ showModal: !this.state.showModal, layer: null });
    }

    showBlock() {
        this.setState({ showBlock: !this.state.showBlock });
    }

    onAdd() {
        this.setState({ showModal: true, layer: null });
    }

    edit(layer) {
        this.setState({ showModal: true, layer: {...layer} });
    }

    remove(placeId, id) {
        this.props.deleteLayer(placeId, id);
    }

    render() {
        const { addLayer, saveLayer, placeId, layers, toShowLayers, showOnMap } = this.props;
        console.log('RENDER <FormGeneral>');

        const iconCollapse = this.state.showBlock ? <span className='glyphicon glyphicon-chevron-up'></span> : <span className='glyphicon glyphicon-chevron-down'></span>;

        return <div className={'row ' + (this.state.showBlock ? styles.show : styles.hidden)}>
            <div className='col-xs-12' onClick={() => { this.showBlock(); }}>
                <h5 className={styles.title}>{iconCollapse} Слои {layers && ` (${layers.length})`}</h5>
            </div>
            <div className={'col-xs-12 form-group ' + styles.toHide}>
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Название</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {layers && layers.length > 0 && layers.map(layer => {
                                const show = toShowLayers.includes(layer._id) ? 'glyphicon-eye-close' : 'glyphicon-eye-open';
                                return <tr key={'key_' + layer._id} className={styles.row}>
                                    <td>{layer._id}</td>
                                    <td>{layer.name}</td>
                                    <td>
                                        <button title='Редактировать' type='button' className='btn btn-primary' onClick={() => {this.edit(layer);}}><span className='glyphicon glyphicon-edit'></span></button>
                                        &nbsp;
                                        <button title='Показать/скрыть на карте' type='button' className='btn btn-primary' onClick={() => {showOnMap(layer._id);}}><span className={'glyphicon ' + show}></span></button>
                                        &nbsp;
                                        <button type='button' className='btn btn-danger' onClick={() => {this.remove(placeId, layer._id);}}><span className='glyphicon glyphicon-remove'></span></button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                
                <button type='button' className='btn btn-info' onClick={() => { this.onAdd(); }}>Добавить слой</button>

                <Modal open={this.state.showModal}>
                    <div className={styles.modalBackground} />
                    <div role='dialog' className={styles.modalDialog}>
                        <header>
                            <button
                                onClick={() => { this.close(); }}
                                type='button'
                                aria-label='close'
                            >
                                ЗАКРЫТЬ
                            </button>
                        </header>
                        <div className={styles.modalContent}>
                            <FormLayerEdit addLayer={addLayer} saveLayer={saveLayer} layer={this.state.layer} placeId={placeId} closeModal={this.close} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    }
}