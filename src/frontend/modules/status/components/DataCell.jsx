import React from 'react';
import PropTypes from 'prop-types';
import styles from './DataCell.scss';
import Modal from './Modal.jsx';
import Docs from '../../docs/containers/Docs.jsx';
import Add from '../../docs/containers/Add.jsx';

export default class DataCell extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            docId: null
        }

        this.close = this.close.bind(this);
        this.editeDoc = this.editeDoc.bind(this);
    }

    close() {
        this.setState({ showModal: !this.state.showModal });
    }

    editeDoc(docId) {
        this.setState({ docId });
    }

    renderCell() {
        const { step, loc_icon, project } = this.props;

        return <span className={styles.links}>
            <span className='glyphicon glyphicon-play' onClick={this.close}></span>
            <Modal open={this.state.showModal}>
                <div className={styles.modalBackground} />
                <div role='dialog' className={styles.modalDialog}>
                    <header>
                        <img src='/images/folder.png' /> {this.props.header}
                        <button
                            onClick={this.close}
                            type='button'
                            aria-label='close'
                        >
                            ЗАКРЫТЬ
                        </button>
                    </header>
                    <div className={styles.modalContent}>
                        <p>
                            <img src={loc_icon} />
                            <img src={project.logo} /> 
                            <p className={styles.nameProj}>{project.name}</p>
                            <p className={styles.addressProj}>{project.address}</p>
                        </p>
                        {this.state.docId === null && <React.Fragment>
                            <p>
                                Документы:
                            </p>
                            <ul>
                                <Docs editeDoc={this.editeDoc} step_id={step.taskId} project_id={project._id} />
                            </ul>
                        </React.Fragment>}
                        {this.state.docId !== null && <React.Fragment>
                            <Add editeDoc={this.editeDoc} id={this.state.docId} step_id={step.taskId} project_id={project._id} />
                        </React.Fragment>}
                    </div>
                </div>
            </Modal>
        </span>;
    }

    render() {
        // const { step } = this.props;
        console.log('RENDER <DataCell>');

        return this.renderCell();
    }
}
DataCell.propTypes = {
    id: PropTypes.string
}