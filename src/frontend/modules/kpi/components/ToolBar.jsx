import React from 'react';
// import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import layoutCss from '../../../common/containers/Layout.scss';

export default class ToolBar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            name: '',
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false, name: '' });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleTextChange(e) {
        const name = e.target.value;
        this.setState({ name });
    }

    handleSubmit() {
        this.props.create(this.state.name);
        this.handleClose();
    }

    render() {
        console.log('RENDER <ToolBar>');

        return <div>
            <div className={layoutCss.bc}>Проекты</div>
            <button type='button' className='btn btn-success' onClick={this.handleShow}>Создать KPI таблицу</button>
            <div className='static-modal'>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Создание KPI таблицы</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form>
                            <div className='form-group'>
                                <label htmlFor='name'>Название</label>
                                <input type='text' className='form-control' id='name' placeholder='Название' onChange={(e) => { this.handleTextChange(e); }} />
                            </div>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <button type='button' className='btn btn-info' onClick={this.handleSubmit}>Создать</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>;
    }
}
// ToolBar.propTypes = {
//     projects: PropTypes.object.isRequired
// }