import React from 'react';
import reactCSS from 'reactcss';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

export default class SketchExample extends React.Component {
  state = {
    displayColorPicker: false
  };

  // componentWillReceiveProps(newProps) {
  //   this.props.onSetColor(newProps.color);
  // }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.props.onSetColor(this.props.index, color.hex, this.props.field);
  };

  render() {

    const labels = {
      color: 'Цвет фона',
      strokColor: 'Цвет обводки'
    };

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${ this.props.color }`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          {labels[this.props.field]}: <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.props.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}

SketchExample.propTypes = {
  onSetColor: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}