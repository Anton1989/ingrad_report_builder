import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import Alert from 'react-bootstrap/lib/Alert';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import styles from './Add.scss';
//Actions
import { get, add, save, dismissError } from '../actions/docsActions';
//Components
// import StyleForm from '../components/StyleForm.jsx';

class Add extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.TYPES = [
            'Договор',
            'ДС',
            'Выписка/Справка/Письмо',
            'Разрешение/Заключение/Ордер',
            'Протокол',
            'Альбом/Чертеж',
            'План-график/Фин.модель',
            'Отчет',
            'Bim-модель',
            'ТУ'
        ];
        this.TU_SUBS = [
            'ЭС',
            'ВС',
            'ХБК',
            'ЛВС',
            'ТС',
            'СС',
            'ГС',
            'СТУ',
            'ДТС',
            'Вырубка'
        ];
        this.state = {
            name: null,
            point: this.props.addDocs,
            number: null,
            type: this.TYPES[0],
            tuTypes: [],
            agent: null,
            version: null,
            project_id: this.props.project_id,
            step_id: this.props.step_id,
            file: null,
            dateDoc: null,
            comment: ''
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
        this.handleUpdateInputCheckbox = this.handleUpdateInputCheckbox.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.onRemoveFile = this.onRemoveFile.bind(this);
    }

    componentDidMount() {
        if (this.props.id) {
            if (this.props.docs.data.length == 0) this.props.get();
            else this.findDoc();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.docs.data.length > 0) {
            this.findDoc(newProps);
        }
    }

    findDoc(props = this.props) {
        let doc = props.docs.data.find(doc => doc._id == props.id);
        doc = { ...doc };
        doc.dateDoc = moment(doc.dateDoc);
        this.setState({ ...doc });
    }

    handleSave() {
        this.props.save(this.state);
        this.props.editeDoc(null);
    }

    handleAdd() {
        this.props.add(this.state);
        this.props.editeDoc(null);
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    handleOnDrop(files) {
        this.setState({
            file: files[0]
        });
    }

    handleUpdateInputText(e) {
        const field = {};
        field[e.target.id] = e.target.value;
        this.setState({ ...field });
    }

    handleUpdateInputCheckbox(e) {
        const target = e.target;
        const checked = target.checked;
        const id = target.id;
        let tuTypes = [ ...this.state.tuTypes ];

        if (checked) {
            if (!tuTypes.includes(id)) {
                tuTypes.push(id);
            }
        } else {
            if (tuTypes.includes(id)) {
                tuTypes.splice(tuTypes.indexOf(id), 1);
            }
        }
        this.setState({ tuTypes });
    }

    handleChangeDate(id, date) {
        const field = {};
        field[id] = date;
        this.setState({ ...field });
    }

    onRemoveFile(e) {
        let upd = {};
        upd[e.target.id] = null;

        this.setState({ ...upd });
    }

    render() {
        const { docs, id, editeDoc } = this.props;
        console.log('RENDER <Add>', this.state);

        let file = null;
        if (this.state.file && typeof this.state.file === 'object') {
            file = <React.Fragment>
                {this.state.file.name} - {this.state.file.size} bytes&nbsp;
                <span id='file' onClick={this.onRemoveFile} className='glyphicon glyphicon-minus-sign'></span>
            </React.Fragment>;
        } else if (this.state.file) {
            file = <React.Fragment>
                <a href={this.state.file} target='_blank'>{this.state.name}</a>&nbsp;
                <span id='file' onClick={this.onRemoveFile} className='glyphicon glyphicon-minus-sign'></span>
            </React.Fragment>;
        } 

        return <React.Fragment>
            {
                docs.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {docs.errors}
                    </Alert>
                </div>
            }
            <form>
                <div className='row'>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='name'>Название</label>
                        <input type='text' className='form-control' id='name' placeholder='Название' value={this.state.name} onChange={this.handleUpdateInputText} />
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='point'>Ключевая точка</label>
                        <input type='text' className='form-control' id='point' placeholder='Ключевая точка' value={this.state.point} onChange={this.handleUpdateInputText} />
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='number'>Номер документа</label>
                        <input type='text' className='form-control' id='number' placeholder='Номер документа' value={this.state.number} onChange={this.handleUpdateInputText} />
                    </div>
                </div>
                <div className='row'>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='point'>Дата документа</label>
                        <DatePicker
                            selected={this.state.dateDoc}
                            onChange={(date) => { this.handleChangeDate('dateDoc', date); }}
                        />
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='type'>Тип</label>
                        <select id='type' className='form-control' value={this.state.type} onChange={this.handleUpdateInputText}>
                            {this.TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        {this.state.type == 'ТУ' && this.TU_SUBS.map(tu => <label>
                            {tu}
                            <input
                                id={tu}
                                key={tu}
                                type='checkbox'
                                checked={this.state.tuTypes.includes(tu)}
                                onChange={this.handleUpdateInputCheckbox} />&nbsp;
                        </label>)}
                    </div>
                </div>
                <div className='row'>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='agent'>Контрагент</label>
                        <input type='text' className='form-control' id='agent' placeholder='Контрагент' value={this.state.agent} onChange={this.handleUpdateInputText} />
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='version'>Номер версии</label>
                        <input type='text' className='form-control' id='version' placeholder='Номер версии' value={this.state.version} onChange={this.handleUpdateInputText} />
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='comment'>Коментарий</label>
                        <textarea className='form-control' id='comment' placeholder='Коментарий' value={this.state.comment} onChange={this.handleUpdateInputText}></textarea>
                    </div>
                </div>
                <div className='row'>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label htmlFor='how'>Кто создал</label>
                        <input type='text' className='form-control' id='how' placeholder='Кто создал' value={this.state.how} onChange={this.handleUpdateInputText} />
                    </div>
                    <div className='form-group col-sm-4 col-md-4'>
                        <label>Файл*</label>
                        <p>
                            {file}
                        </p>
                        <Dropzone
                            className={styles.dropzone}
                            onDrop={this.handleOnDrop}
                            multiple={false}
                        >
                            {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                if (isDragActive) {
                                    return 'Данный тип фалов разрешен';
                                }
                                if (isDragReject) {
                                    return 'Данный тип фалов запрещен';
                                }
                                return acceptedFiles.length || rejectedFiles.length
                                    ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                                    : 'Загрузите файл';
                            }}
                        </Dropzone>
                    </div>
                </div>
                {!id && <div className='row'>
                    <div className='col-xs-12'>
                        <a className='btn btn-default' onClick={() => { editeDoc(null); }}>
                            <span className='glyphicon glyphicon-chevron-left'></span> Назад
                        </a> &nbsp;
                        <button type='button' className='btn btn-info' onClick={this.handleAdd}><span className='glyphicon glyphicon-plus-sign'></span> Добавить</button>
                    </div>
                </div>}
                {id && <div className='row'>
                    <div className='col-xs-12'>
                        <a className='btn btn-default' onClick={() => { editeDoc(null); }}>
                            <span className='glyphicon glyphicon-chevron-left'></span> Назад
                        </a> &nbsp;
                        <button type='button' className='btn btn-info' onClick={this.handleSave}><span className='glyphicon glyphicon-floppy-disk'></span> Сохранить</button>
                    </div>
                </div>}
            </form>
        </React.Fragment>;
    }
}
function mapStateToProps(state) {
    return {
        docs: state.docs
    }
}
function mapDispatchToProps(dispatch) {
    return {
        get: bindActionCreators(get, dispatch),
        add: bindActionCreators(add, dispatch),
        save: bindActionCreators(save, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add);