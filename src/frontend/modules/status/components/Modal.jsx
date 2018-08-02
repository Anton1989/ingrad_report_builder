import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import styles from './Modal.scss';

export default class Modal extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.el = document.createElement('div');
        this.el.classList.add(styles.modal);
    }

    componentDidMount() {
        document.getElementById('root-modal').appendChild(this.el);
    }

    componentWillUnmount() {
        document.getElementById('root-modal').removeChild(this.el);
    }

    render() {
        // const { step } = this.props;
        // console.log('RENDER <Modal>');

        return this.props.open ? (
            ReactDOM.createPortal(
                this.props.children,
                this.el
            )
        ) : null;

        // return this.props.open ? (
        //     <div className={styles.modal}>
        //         <div className={styles.modalBackground} />
        //         <div role='dialog' className={styles.modalDialog}>
        //             <header>
        //                 <span>{this.props.header}</span>
        //                 <button
        //                     onClick={() => this.props.onClose()}
        //                     type='button'
        //                     aria-label='close'
        //                 >
        //                     CLOSE
        //                 </button>
        //             </header>
        //             <div className={styles.modalContent}>{this.props.children}</div>
        //         </div>
        //     </div>
        // ) : null;
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }