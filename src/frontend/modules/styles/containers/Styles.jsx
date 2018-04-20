import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { getStyles, save, dismissError } from '../actions/stylesActions';
//Components
import StyleForm from '../components/StyleForm.jsx';

class Styles extends React.Component {

    componentDidMount() {
        if (this.props.styles.data.length == 0) this.props.getStyles();
    }
    
    render() {
        const { styles, save, dismissError } = this.props;
        console.log('RENDER <Styles>');

        return <StyleForm mapStyles={styles} save={save} dismissError={dismissError} />
    }
}
function mapStateToProps(state) {
    return {
        styles: state.styles
    }
}
function mapDispatchToProps(dispatch) {
    return {
        save: bindActionCreators(save, dispatch),
        getStyles: bindActionCreators(getStyles, dispatch),
        dismissError: bindActionCreators(dismissError, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Styles);