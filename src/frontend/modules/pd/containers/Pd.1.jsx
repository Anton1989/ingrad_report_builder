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

        this.onDropCsv = this.onDropCsv.bind(this);
    }

    onDropCsv(files) {
        console.log(files);
        this.props.upload(files[0]);
    }

    render() {
        const { pds } = this.props;
        console.log('RENDER <Pd>');

        return <div className={styles.pd}>
            <div>
                <h2>Загрузите CSV шаблон</h2>
                <Dropzone
                    className={styles.dropzone}
                    onDrop={this.onDropCsv}
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