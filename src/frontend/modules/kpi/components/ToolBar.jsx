import React from 'react';
// import PropTypes from 'prop-types';
import layoutCss from '../../../common/containers/Layout.scss';

export default class ToolBar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleDownload = this.handleDownload.bind(this);
    }

    handleDownload() {

    }

    render() {
        console.log('RENDER <ToolBar>');

        return <div>
            <div className={layoutCss.bc}>Проекты</div>
        </div>;
    }
}
// ToolBar.propTypes = {
//     id: PropTypes.string
// }