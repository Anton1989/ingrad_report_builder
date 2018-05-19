import React from 'react';
// import PropTypes from 'prop-types';
//import styles from './DataCell.scss';
//import Modal from './Modal.jsx';

export default class dataCell extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false
        }

        this.close = this.close.bind(this);
    }

    close() {
        this.setState({ showModal: !this.state.showModal });
    }

    renderCell() {
        const { step/*, loc_icon, project*/ } = this.props;
        let html = null;

        html = <span>{step.percentComplete}</span>;

        /*
        switch (step.type) {
            case 'quarter': {
                let parts = step.value.split(' ');
                html = <span>{parts[0]}<br />{parts[1]}</span>;
                break;
            }
            case 'date': {
                const date = new Date(step.value * 1000);
                const day = date.getDay();
                const month = date.getMonth();
                const year = date.getFullYear().toString();

                html = <span>{day < 10 ? '0' + day : day}.{month < 10 ? '0' + month : month}.{year.substring(2)}</span>;
                break;
            }
            case 'text': {
                html = <span>{step.value}</span>;
                break;
            }
            case 'links': {
                html = <span className={styles.links}>
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
                                <p>
                                    Документы:
                                </p>
                                <ul>
                                    {step.value.map(link => <li key={link.url}><a href={link.url} target='_blank'>{link.name}</a></li>)}
                                </ul>
                            </div>
                        </div>
                    </Modal>
                </span>;
                break;
            }
            default: {
                break;
            }
        }
        */
        return html;
    }

    render() {
        // const { step } = this.props;
        //console.log('RENDER <DataCell>');

        return this.renderCell();
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }