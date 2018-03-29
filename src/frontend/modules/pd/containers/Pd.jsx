import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
import Dropzone from 'react-dropzone';
//Actions
import { upload, dismissError } from '../actions/pdActions';
//Components
// import StyleForm from '../components/StyleForm.jsx';

import styles from './Pd.scss';

class Pd extends React.Component {

    constructor() {
        super();

        this.state = {
            csvDie: null,
            csvLive: null,
            xmlTamplate: null,
            csvOtherCommonProperties: null,
            csvCommonAreas: null
        };

        this.onDropLiveCsv = this.onDropLiveCsv.bind(this);
        this.onDropUnLiveCsv = this.onDropUnLiveCsv.bind(this);
        this.onDropXmlTamplate = this.onDropXmlTamplate.bind(this);
        this.onDropCommonAreasCsv = this.onDropCommonAreasCsv.bind(this);
        this.onDropOtherCommonPropertiesCsv = this.onDropOtherCommonPropertiesCsv.bind(this);
        this.upload = this.upload.bind(this);
    }

    onDropLiveCsv(files) {
        console.log(files);
        this.setState({
            csvLive: files[0]
        });
    }

    onDropUnLiveCsv(files) {
        console.log(files);
        this.setState({
            csvDie: files[0]
        });
    }

    onDropCommonAreasCsv(files) {
        console.log(files);
        this.setState({
            csvCommonAreas: files[0]
        });
    }

    onDropOtherCommonPropertiesCsv(files) {
        console.log(files);
        this.setState({
            csvOtherCommonProperties: files[0]
        });
    }

    onDropXmlTamplate(files) {
        console.log(files);
        this.setState({
            xmlTamplate: files[0]
        });
    }

    upload() {
        console.log(this.state);
        this.props.upload(this.state);
    }

    render() {
        const { pds } = this.props;
        console.log('RENDER <Pd>');

        return <div className={styles.pd}>
            <div>
                <h2>Загрузите XML шаблон декларации</h2>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={this.onDropXmlTamplate}
                    multiple={false}
                >
                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (isDragActive) {
                            return 'Данный тип файлов разрешен';
                        }
                        if (isDragReject) {
                            return 'Данный тип файлов запрещен';
                        }
                        return acceptedFiles.length || rejectedFiles.length
                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                            : 'Загрузите CSV';
                    }}
                </Dropzone>
            </div>
            <div>
                <h2>Загрузите CSV списка жилых помещений</h2>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={this.onDropLiveCsv}
                    multiple={false}
                >
                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (isDragActive) {
                            return 'Данный тип файлов разрешен';
                        }
                        if (isDragReject) {
                            return 'Данный тип файлов запрещен';
                        }
                        return acceptedFiles.length || rejectedFiles.length
                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                            : 'Загрузите CSV';
                    }}
                </Dropzone>
            </div>
            <div>
                <h2>Загрузите CSV списка НЕжилых помещений</h2>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={this.onDropUnLiveCsv}
                    multiple={false}
                >
                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (isDragActive) {
                            return 'Данный тип файлов разрешен';
                        }
                        if (isDragReject) {
                            return 'Данный тип файлов запрещен';
                        }
                        return acceptedFiles.length || rejectedFiles.length
                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                            : 'Загрузите CSV';
                    }}
                </Dropzone>
            </div>
            <div>
                <h2>Загрузите CSV списка помещений общего пользования</h2>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={this.onDropCommonAreasCsv}
                    multiple={false}
                >
                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (isDragActive) {
                            return 'Данный тип файлов разрешен';
                        }
                        if (isDragReject) {
                            return 'Данный тип файлов запрещен';
                        }
                        return acceptedFiles.length || rejectedFiles.length
                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                            : 'Загрузите CSV';
                    }}
                </Dropzone>
            </div>
            <div>
                <h2>Загрузите CSV списка техн. оборудования</h2>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={this.onDropOtherCommonPropertiesCsv}
                    multiple={false}
                >
                    {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                        if (isDragActive) {
                            return 'Данный тип файлов разрешен';
                        }
                        if (isDragReject) {
                            return 'Данный тип файлов запрещен';
                        }
                        return acceptedFiles.length || rejectedFiles.length
                            ? `Загружено ${acceptedFiles.length}, отклонено ${rejectedFiles.length} файлов`
                            : 'Загрузите CSV';
                    }}
                </Dropzone>
            </div>
            <div>
                <br/>
                <button type='button' className='btn btn-info' onClick={this.upload}>Конвертировать</button>
                <br/>
            </div>
            <div>
                {pds.data && pds.data.length > 0 && <h2>Сгенерированные файлы:</h2>}
                <ul>
                    {pds.data && pds.data.map(pd => <li key={pd}><a href={pd} target='_blank'>{pd}</a></li>)}
                </ul>
            </div>
        </div>
    }
}
function mapStateToProps(state) {
    return {
        pds: state.pd
    }
}
function mapDispatchToProps(dispatch) {
    return {
        upload: bindActionCreators(upload, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pd);