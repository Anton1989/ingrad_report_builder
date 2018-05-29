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
    color: '#000000',
    fillOpacity: 0.8,
    strokeOpacity: 0.8,
    lineStyle: 'solide'
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
        this.setState({
            styles: this.props.mapStyles.data.map(style => {
                return Object.assign({}, { ...DEFAULT_STYLE }, style);
            })
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            styles: newProps.mapStyles.data.map(style => {
                return Object.assign({}, { ...DEFAULT_STYLE }, style);
            })
        });
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
            <h1>Стили карты</h1>
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
                        <input type='text' className='form-control' id='name' placeholder='Имя стиля' value={mapStyle.name} onChange={e => this.updateInputText(e, i)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='width'>Ширина обводки</label>
                        <input type='number' className='form-control' id='width' placeholder='Ширина обводки' value={mapStyle.width} onChange={e => this.updateInputText(e, i)} />
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor='lineStyle'>Стиль обводки</label>
                        <select id='lineStyle' className='form-control' value={mapStyle.lineStyle} onChange={e => this.updateInputText(e, i)}>
                            <option value='solide'>Сплошная линия</option>
                            <option value='dashed'>Пунктирная линия</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <SketchExample onSetColor={this.onSetColor} color={mapStyle.strokColor} index={i} field='strokColor' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='strokeOpacity'>Прозрачность обводки</label>
                        <input type='number' className='form-control' id='strokeOpacity' placeholder='Прозрачность обводки' value={mapStyle.strokeOpacity} onChange={e => this.updateInputText(e, i)} />
                    </div>
                    <div className='form-group'>
                        <SketchExample onSetColor={this.onSetColor} color={mapStyle.color} index={i} field='color' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='fillOpacity'>Прозрачность фона</label>
                        <input type='number' className='form-control' id='fillOpacity' placeholder='Прозрачность фона' value={mapStyle.fillOpacity} onChange={e => this.updateInputText(e, i)} />
                    </div>
                    <hr />
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