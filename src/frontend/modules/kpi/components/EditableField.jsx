import React from 'react';
import PropTypes from 'prop-types';
//Components
import styles from './EditableField.scss';

export default class EditableField extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            value: '',
            style: null,
            editable: false
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleStyleChange = this.handleStyleChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        this.setState({ value: this.props.value, style: this.props.style });
    }

    handleTextChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }

    handleStyleChange(e) {
        const style = e.target.value == '' ? null : e.target.value;
        this.setState({ style });
    }

    handleShow() {
        this.setState({ editable: true, value: this.props.value, style: this.props.style });
    }

    handleSave() {
        this.props.save(this.props.name, this.state.value, this.state.style);
        this.setState({ editable: false, value: '', style: null });
    }

    handleCancel() {
        this.setState({ editable: false, value: '', style: null });
    }

    prepareString(str) {
        if (!str) return str;
        
        const arr = str.split(/\n/g);
        return arr.map(item => [item, <br/>]);
    }

    render() {
        const { name, value, kpiStyles, textarea } = this.props;
        console.log('RENDER <EditableField>');

        let field = <span onClick={this.handleShow}>{this.prepareString(value)} <span className='glyphicon glyphicon-edit'></span></span>;
        if (this.state.editable) {
            let textedit = <input type='text' className='form-control' id={name} value={this.state.value} onChange={(e) => { this.handleTextChange(e); }} />;
            if (textarea) {
                textedit = <textarea className='form-control' id={name} onChange={(e) => { this.handleTextChange(e); }}>{this.state.value}</textarea>;
            }
            field = <p className={styles.editableField}>
                {textedit}
                <select className='form-control' value={this.state.style} onChange={this.handleStyleChange}>
                    <option key='nostyle' value=''>--Без стиля--</option>
                    {kpiStyles.map(style => <option key={style._id} value={style._id}>{style.name}</option>)}
                </select>
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
