import React from 'react';
import PropTypes from 'prop-types';
//Components
import styles from './EditableField.scss';

export default class EditableField extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            value: '',
            editable: false
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        this.setState({ value: this.props.value });
    }

    handleTextChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }

    handleShow() {
        this.setState({ editable: true, value: this.props.value });
    }

    handleSave() {
        this.props.save(this.props.name, this.state.value);
        this.setState({ editable: false, value: '' });
    }

    handleCancel() {
        this.setState({ editable: false, value: '' });
    }

    render() {
        const { name, value } = this.props;
        console.log('RENDER <EditableField>');

        let field = <span onClick={this.handleShow}>{value} <span className='glyphicon glyphicon-edit'></span></span>;
        if (this.state.editable) {
            field = <p className={styles.editableField}>
                <input type='text' className='form-control' id={name} value={this.state.value} onChange={(e) => { this.handleTextChange(e); }} />
                <button type='button' className='btn btn-success' onClick={this.handleSave}><span className='glyphicon glyphicon-ok'></span></button>
                <button type='button' className='btn btn-danger' onClick={this.handleCancel}><span className='glyphicon glyphicon-ban-circle'></span></button>
            </p>;
        }

        return field;
    }
}

EditableField.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    save: PropTypes.func.isRequired,
}
