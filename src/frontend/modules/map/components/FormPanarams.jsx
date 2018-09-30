import React from 'react';
import Modal from '../../../common/components/Modal.jsx';
import FormPanaramEdit from './FormPanaramEdit.jsx';
// Styles
import styles from './FormPanarams.scss';

export default class FormPanarams extends React.Component {

    constructor() {
        super();

        this.state = {
            showBlock: false,
            showModal: false,
            panaram: null,
        }

        this.close = this.close.bind(this);
    }

    componentWillMount() {
        if (this.props.placeId && this.props.panarams === undefined && !this.props.detailFetching) {
            this.props.getDetails(this.props.placeId);
        }
    }

    close() {
        this.setState({ showModal: !this.state.showModal, panaram: null });
    }

    showBlock() {
        this.setState({ showBlock: !this.state.showBlock });
    }

    onAdd360() {
        this.setState({ showModal: true, panaram: null });
    }

    edit360(panaram) {
        this.setState({ showModal: true, panaram: {...panaram} });
    }

    remove360(placeId, id) {
        this.props.deletePanaram(placeId, id);
    }

    render() {
        const { addPanorame, savePanorame, placeId, panarams } = this.props;
        console.log('RENDER <FormGeneral>');

        const iconCollapse = this.state.showBlock ? <span className='glyphicon glyphicon-chevron-up'></span> : <span className='glyphicon glyphicon-chevron-down'></span>;

        return <div className={'row ' + (this.state.showBlock ? styles.show : styles.hidden)}>
            <div className='col-xs-12' onClick={() => { this.showBlock(); }}>
                <h5 className={styles.title}>{iconCollapse} Панорамы {panarams && ` (${panarams.length})`}</h5>
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
                            {panarams && panarams.length > 0 && panarams.map(panaram => {
                                return <tr key={'key_' + panaram._id} className={styles.row}>
                                    <td>{panaram._id}</td>
                                    <td>{panaram.name}</td>
                                    <td>
                                        <button type='button' className='btn btn-primary' onClick={() => {this.edit360(panaram);}}><span className='glyphicon glyphicon-edit'></span></button>
                                        &nbsp;
                                        <button type='button' className='btn btn-danger' onClick={() => {this.remove360(placeId, panaram._id);}}><span className='glyphicon glyphicon-remove'></span></button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                
                <button type='button' className='btn btn-info' onClick={() => { this.onAdd360(); }}>Добавить 360</button>

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
                            <FormPanaramEdit addPanorame={addPanorame} savePanorame={savePanorame} panaram={this.state.panaram} placeId={placeId} closeModal={this.close} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    }
}