import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import Alert from 'react-bootstrap/lib/Alert';
import Link from 'react-router/lib/Link';
//Actions
import { get, del, dismissError } from '../actions/docsActions';
//Components
// import StyleForm from '../components/StyleForm.jsx';
import styles from './Docs.scss';
import config from '../../../config';

class Docs extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            type: 'ALL'
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
    }

    componentDidMount() {
        if (this.props.docs.data.length == 0) this.props.get();
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    handleUpdateInputText(e) {
        const field = {};
        field[e.target.id] = e.target.value;
        this.setState({ ...field });
    }

    handleDelete(id) {
        this.props.del(id);
    }
    
    render() {
        const { docs } = this.props;
        console.log('RENDER <Docs>');

        const docsFiltered = this.state.type != 'ALL' ? docs.data.filter(doc => doc.type == this.state.type) : docs.data;

        return <React.Fragment>
            {
                docs.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {docs.errors}
                    </Alert>
                </div>
            }
            <Link className='btn btn-default' to='/add'>
                <span className='glyphicon glyphicon-plus-sign'></span> Добавить
            </Link>
            <br/><br/>
            <div className='row'>
                <div className='col-xs-2'>
                    <div className='form-group'>
                        <select id='type' className='form-control' value={this.state.type} onChange={this.handleUpdateInputText}>
                            <option value='ALL'>Выберите Тип</option>;
                            {config.types.map(type => {
                                return <option key={type} value={type}>{type}</option>;
                            })}
                        </select>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                {docsFiltered.length > 0 && <table className={'table ' + styles.list}>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Тип</th>
                            <th>Проект</th>
                            <th>Титульный объект</th>
                            <th>Дата получения</th>
                            <th>Коментарий</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {docsFiltered.map(doc => {
                            return <tr key={doc._id}>
                                <td>
                                    <Link to={'/edit/' + doc._id}>
                                        {doc.name}
                                    </Link>
                                </td>
                                <td>{doc.type}</td>
                                <td>{doc.project}</td>
                                <td>{doc.object}</td>
                                <td>{doc.recieved_at}</td>
                                <td>{doc.comment}</td>
                                <td>
                                    <button onClick={() => { this.handleDelete(doc._id); }} className='btn btn-danger'><span className='glyphicon glyphicon-remove-circle'></span></button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>}
            </div>
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
        del: bindActionCreators(del, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Docs);