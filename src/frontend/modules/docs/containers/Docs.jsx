import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import Alert from 'react-bootstrap/lib/Alert';
import moment from 'moment';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
//Actions
import { get, del, dismissError } from '../actions/docsActions';
//Components
// import StyleForm from '../components/StyleForm.jsx';
import styles from './Docs.scss';

class Docs extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            docs: []
        };

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
    }

    componentDidMount() {
        const docs = this.props.docs.data.filter(doc => (this.props.project_id == doc.project_id && this.props.step_id == doc.step_id));
        this.setState({ docs });
        if (docs.length == 0) this.props.get(this.props.project_id, this.props.step_id);
    }

    componentWillReceiveProps(newProps) {
        const docs = newProps.docs.data.filter(doc => (newProps.project_id == doc.project_id && newProps.step_id == doc.step_id));
        this.setState({ docs });
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
        const { docs, editeDoc } = this.props;
        console.log('RENDER <Docs>');

        const data = this.state.docs.map(doc => {
            const date = moment(doc.dateDoc);

            return {
                point: doc.point,
                name: <a className={styles.editable} onClick={() => { editeDoc(doc._id); }}>{doc.name}</a>,
                date: date.format('DD/MM/YYYY'),
                number: doc.number,
                version: doc.version,
                type: doc.type,
                tools: <React.Fragment>
                    <a href={doc.file} target='_blank' className='btn btn-success'><span className='glyphicon glyphicon-download-alt'></span></a>
                    <button onClick={() => { this.handleDelete(doc._id); }} className='btn btn-danger'><span className='glyphicon glyphicon-remove-circle'></span></button>
                </React.Fragment>

            };
        });
        
        const columns = [{
            Header: 'Ключевая точка',
            accessor: 'point',
            sortable: true,
            filterable: true
        },{
            Header: 'Название',
            accessor: 'name',
            sortable: true,
            filterable: true
        },{
            Header: 'Дата документа',
            accessor: 'date',
            sortable: true,
            filterable: true
        },{
            Header: 'Номер документа',
            accessor: 'number',
            sortable: true,
            filterable: true
        },{
            Header: 'Номер версии',
            accessor: 'version',
            sortable: true,
            filterable: true
        },{
            Header: 'Тип',
            accessor: 'type',
            sortable: true,
            filterable: true
        }, {
            Header: '',
            accessor: 'tools'
        }];

        return <React.Fragment>
            {
                docs.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {docs.errors}
                    </Alert>
                </div>
            }
            <div className='table-responsive'>
                {this.state.docs.length == 0 && <p>Нет прикрепленных документов</p>}
                {this.state.docs.length > 0 && <ReactTable
                    className={'table ' + styles.list}
                    data={data}
                    defaultSortDesc={true}
                    defaultSorted={[{ id: 'date' }]}
                    columns={columns}
                />}
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