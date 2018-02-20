import React from 'react';
import PropTypes from 'prop-types';
//Components
import Alert from 'react-bootstrap/lib/Alert';
import Loading from '../../../common/components/Loading.jsx';
import SketchExample from './SketchExample.jsx';
// Styles
import styles from './StyleForm.scss';

const DEFAULT_STYLE = {
    name: '',
    width: 2,
    strokColor: '#000000',
    color: '#000000'
}

export default class StyleForm extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            styles: [],
            errors: []
        }

        this._handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.updateInputText = this.updateInputText.bind(this);
        this.onSetColor = this.onSetColor.bind(this);
        this.onAddStyle = this.onAddStyle.bind(this);
        this.onSaveAll = this.onSaveAll.bind(this);
    }

    componentWillMount() {
        this.setState({ styles: [...this.props.mapStyles.data] });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ styles: [...newProps.mapStyles.data] });
    }

    handleAlertDismiss() {
        this.props.dismissError();
    }

    onSetColor(index, color, field) {
        let styles = [...this.state.styles];
        styles[index][field] = color;

        this.setState({ styles });
    }

    onAddStyle() {
        let styles = [...this.state.styles];
        styles.push({ ...DEFAULT_STYLE });
        this.setState({ styles });
    }

    onSaveAll() {
        let styles = [...this.state.styles];
        this.props.save(styles);
    }

    updateInputText(e, index) {
        let styles = [...this.state.styles];
        styles[index][e.target.id] = e.target.value;

        this.setState({ styles });
    }

    render() {
        const { mapStyles } = this.props;
        console.log('RENDER <StyleForm>', this.state);

        return <div className={styles.detailPage}>
            <h1>Стили</h1>
            {
                mapStyles.errors && <div className='col-xs-12'>
                    <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
                        <strong>ERROR:</strong> {mapStyles.errors}
                    </Alert>
                </div>
            }
            {mapStyles.fetching && mapStyles.data.length == 0 && <Loading />}
            {this.state.styles.length > 0 && this.state.styles.map((mapStyle, i) => {
                return <div key={'style_' + i}>
                    <div className='form-group'>
                        <label htmlFor='name'>Имя стиля</label>
                        <input key={i + '_name'} type='text' className='form-control' id='name' placeholder='Имя стиля' value={mapStyle.name} onChange={e => this.updateInputText(e, i)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='width'>Ширина обводки</label>
                        <input key={i + '_width'} type='number' className='form-control' id='width' placeholder='Ширина обводки' value={mapStyle.width} onChange={e => this.updateInputText(e, i)} />
                    </div>
                    <div className='form-group'>
                        <SketchExample onSetColor={this.onSetColor} color={mapStyle.strokColor} index={i} field='strokColor' />
                    </div>
                    <div className='form-group'>
                        <SketchExample onSetColor={this.onSetColor} color={mapStyle.color} index={i} field='color' />
                    </div>
                </div>
            })}
            <div className='row'>
                <div className='col-xs-12'>
                    <button type='button' className='btn btn-info' onClick={this.onAddStyle}><span className='glyphicon glyphicon-plus-sign'></span> Добавить стиль</button>
                </div>
            </div>
            <br />
            <div className='row'>
                <div className='col-xs-12'>
                    <button type='button' className='btn btn-success' onClick={this.onSaveAll}>Сохранить стили</button>
                </div>
            </div>
        </div>
    }
}
StyleForm.propTypes = {
    mapStyles: PropTypes.object.isRequired,
    dismissError: PropTypes.func.isRequired
}