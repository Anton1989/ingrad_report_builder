import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import Alert from 'react-bootstrap/lib/Alert';
import Link from 'react-router/lib/Link';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import browserHistory from 'react-router/lib/browserHistory';
//Actions
import { get, add, save, dismissError } from '../actions/docsActions';
//Components
// import StyleForm from '../components/StyleForm.jsx';
import config from '../../../config';

class Add extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            name: '',
            type: config.types[0],
            project: config.projects[0].name,
            object: config.projects[0].objects[0],
            recieved_at: null,
            comment: ''
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        if (this.props.params.id) {
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
        let doc = props.docs.data.find(doc => doc._id == props.params.id);
        doc = { ...doc };
        doc.recieved_at = moment(doc.recieved_at);
        this.setState({ ...doc });
    }

    handleSave() {
        this.props.save(this.state);
        browserHistory.push('/');
    }

    handleAdd() {
        this.props.add(this.state);
        browserHistory.push('/');
    }

    handleAlertDismiss() {
        this.props.dismissError();
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

    render() {
        const { docs, params: { id } } = this.props;
        console.log('RENDER <Add>');

        const project = config.projects.find(project => project.name == this.state.project);

        return <React.Fragment>
            {
                docs.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {docs.errors}
                    </Alert>
                </div>
            }
            <Link className='btn btn-default' to='/'>
                <span className='glyphicon glyphicon-chevron-left'></span> Назад
            </Link>
            <br /><br />
            <form>
                <div className='form-group'>
                    <label htmlFor='name'>Название</label>
                    <input type='text' className='form-control' id='name' placeholder='Название' value={this.state.name} onChange={this.handleUpdateInputText} />
                </div>
                <div className='form-group'>
                    <label htmlFor='type'>Тип</label>
                    <select id='type' className='form-control' value={this.state.type} onChange={this.handleUpdateInputText}>
                        {config.types.map(type => {
                            return <option key={type} value={type}>{type}</option>;
                        })}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='project'>Проект</label>
                    <select id='project' className='form-control' value={this.state.project} onChange={this.handleUpdateInputText}>
                        {config.projects.map(project => {
                            return <option key={project.name} value={project.name}>{project.name}</option>;
                        })}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='object'>Титульный объект</label>
                    <select id='object' className='form-control' value={this.state.object} onChange={this.handleUpdateInputText}>
                        {project.objects.map(object => {
                            return <option key={object} value={object}>{object}</option>;
                        })}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='recieved_at'>Дата получения</label>
                    <DatePicker
                        selected={this.state.recieved_at}
                        onChange={(date) => { this.handleChangeDate('recieved_at', date); }}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='comment'>Коментарий</label>
                    <textarea className='form-control' id='comment' placeholder='Коментарий' value={this.state.comment} onChange={this.handleUpdateInputText}></textarea>
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