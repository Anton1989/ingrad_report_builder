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
        // if (this.state.showModal === false) {

        // }
        this.setState({ showModal: !this.state.showModal, docId: null });
    }

    editeDoc(docId) {
        this.setState({ docId });
    }

    renderCell() {
        const { step, loc_icon, project, title, headerCode } = this.props;

        let iconClass = 'glyphicon-play';
        if (step == null) {
            iconClass = 'glyphicon-ban-circle';
        } else if (step.isInner) {
            iconClass = 'glyphicon-arrow-down';
        }

        return <span className={styles.links}>
            <span className={'glyphicon ' + iconClass} onClick={this.close}></span>
            <Modal open={this.state.showModal}>
                <div className={styles.modalBackground} />
                <div role='dialog' className={styles.modalDialog}>
                    <header>
                        <img src='/images/folder.png' /> {this.props.headerName}
                        <button
                            onClick={this.close}
                            type='button'
                            aria-label='close'
                        >
                            ЗАКРЫТЬ
                        </button>
                    </header>
                    <div className={styles.modalContent}>
                        {this.state.docId === null && <React.Fragment>
                            <p>
                                <img src={loc_icon} />
                                <img src={project.logo} /> 
                                <p className={styles.nameProj}>{title}</p>
                                <p className={styles.addressProj}>{project.address}</p>
                            </p>
                            <p>
                                Документы:
                            </p>
                            <a className={'btn btn-default ' + styles.addDoc} onClick={() => { this.editeDoc(0); }}>
                                <span className='glyphicon glyphicon-plus-sign'></span> Добавить
                            </a>
                            <Docs editeDoc={this.editeDoc} step_id={headerCode} project_id={project.code} />
                        </React.Fragment>}
                        {this.state.docId !== null && <React.Fragment>
                            <Add editeDoc={this.editeDoc} addDocs={this.props.headerName} headerCode={this.props.headerCode} id={this.state.docId} step_id={headerCode} project_id={project.code} />
                        </React.Fragment>}
                    </div>
                </div>
            </Modal>
        </span>;
    }

    render() {
        // const { step } = this.props;
        // console.log('RENDER <DataCell>');

        return this.renderCell();
    }
}
DataCell.propTypes = {
    id: PropTypes.string
}