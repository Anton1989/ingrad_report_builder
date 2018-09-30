import React from 'react';
import ReactDOM from 'react-dom';
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
    }
}