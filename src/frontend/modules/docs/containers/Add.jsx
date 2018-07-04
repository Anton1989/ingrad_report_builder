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

        this.state = {
            name: '',
            project_id: this.props.project_id,
            step_id: this.props.step_id,
            file: null,
            recieved_at: null,
            comment: ''
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
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
        doc.recieved_at = moment(doc.recieved_at);
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
        console.log('RENDER <Add>');

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
            <a className='btn btn-default' onClick={() => { editeDoc(null); }}>
                <span className='glyphicon glyphicon-chevron-left'></span> Назад
            </a>
            <br /><br />
            <form>
                <div className='row'>
                    <div className='form-group col-sm-6 col-md-6'>
                        <label htmlFor='name'>Название</label>
                        <input type='text' className='form-control' id='name' placeholder='Название' value={this.state.name} onChange={this.handleUpdateInputText} />
                    </div>
                    <div className='form-group col-sm-6 col-md-6'>
                        <label htmlFor='recieved_at'>Дата получения</label>
                        <DatePicker
                            selected={this.state.recieved_at}
                            onChange={(date) => { this.handleChangeDate('recieved_at', date); }}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='form-group col-sm-6 col-md-6'>
                        <label htmlFor='comment'>Коментарий</label>
                        <textarea className='form-control' id='comment' placeholder='Коментарий' value={this.state.comment} onChange={this.handleUpdateInputText}></textarea>
                    </div>
                    <div className='form-group col-sm-6 col-md-6'>
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
                        <button type='button' className='btn btn-info' onClick={this.handleAdd}><span className='glyphicon glyphicon-plus-sign'></span> Добавить</button>
                    </div>
                </div>}
                {id && <div className='row'>
                    <div className='col-xs-12'>
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