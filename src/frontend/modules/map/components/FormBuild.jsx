import React from 'react';
import Modal from '../../../common/components/Modal.jsx';
import FormBuildEdit from './FormBuildEdit.jsx';
// Styles
import styles from './FormPanarams.scss';

const TYPES = {
    camera: 'Камера',
    house: 'Строение',
    tube: 'Комуникация'
}

export default class FormLayers extends React.Component {

    constructor() {
        super();

        this.state = {
            showBlock: false,
            showModal: false,
            build: null,
        }

        this.close = this.close.bind(this);
    }

    // componentWillMount() {
    //     if (this.props.placeId && this.props.panarams === undefined && !this.props.detailFetching) {
    //         this.props.getDetails(this.props.placeId);
    //     }
    // }

    close() {
        this.setState({ showModal: !this.state.showModal, build: null });
    }

    showBlock() {
        this.setState({ showBlock: !this.state.showBlock });
    }

    onAdd() {
        this.setState({ showModal: true, build: null });
    }

    edit(build) {
        this.setState({ showModal: true, build: {...build} });
    }

    remove(placeId, id) {
        this.props.delete(placeId, id);
    }

    render() {
        const { add, mapStyles, save, placeId, builds } = this.props;
        console.log('RENDER <FormGeneral>');

        const iconCollapse = this.state.showBlock ? <span className='glyphicon glyphicon-chevron-up'></span> : <span className='glyphicon glyphicon-chevron-down'></span>;

        return <div className={'row ' + (this.state.showBlock ? styles.show : styles.hidden)}>
            <div className='col-xs-12' onClick={() => { this.showBlock(); }}>
                <h5 className={styles.title}>{iconCollapse} Строения и камеры {builds && ` (${builds.length})`}</h5>
            </div>
            <div className={'col-xs-12 form-group ' + styles.toHide}>
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Тип</th>
                                <th>Название</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {builds && builds.length > 0 && builds.map(build => {
                                return <tr key={'key_' + build._id} className={styles.row}>
                                    <td>{build._id}</td>
                                    <td>{TYPES[build.type]}</td>
                                    <td>{build.name}</td>
                                    <td>
                                        <button title='Редактировать' type='button' className='btn btn-primary' onClick={() => {this.edit(build);}}><span className='glyphicon glyphicon-edit'></span></button>
                                        &nbsp;
                                        <button type='button' className='btn btn-danger' onClick={() => {this.remove(placeId, build._id);}}><span className='glyphicon glyphicon-remove'></span></button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                
                <button type='button' className='btn btn-info' onClick={() => { this.onAdd(); }}>Добавить строение</button>

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
                            <FormBuildEdit mapStyles={mapStyles} add={add} save={save} build={this.state.build} placeId={placeId} closeModal={this.close} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    }
}