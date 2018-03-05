import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Target extends Component {
  constructor(props) {
    super(props);

    this.onMount = props.onMount.bind(this);
    this.onUnmount = props.onUnmount.bind(this);

    this.handleMouseDown = props.handleMouseDown.bind(this);
    this.handleMouseUp   = props.handleMouseUp.bind(this);
    this.handleMouseMove = props.handleMouseMove.bind(this);

    this.handleTouchStart = props.handleTouchStart.bind(this);
    this.handleTouchEnd   = props.handleTouchEnd.bind(this);
    this.handleTouchMove  = props.handleTouchMove.bind(this);
  }

  componentDidMount() {
    this.onMount(this.props.dispatch);
  }

  componentWillUnmount() {
    this.onUnmount();
  }

  render() {
    return (
      <div id="container" ref={el => this.container = el}
        onMouseMove={this.handleMouseMove}
        onTouchMove={this.handleTouchMove}
      >
        <div
          id="target"
          ref={el => this.target = el}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          style={{top: this.props.top, left: this.props.left}}
        >
          <p>Touch/click and drag me</p>
        </div>
      </div>
    )
  }
}

Target.propTypes = {
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  handleMouseUp: PropTypes.func.isRequired,
  handleMouseMove: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
  handleTouchEnd: PropTypes.func.isRequired,
  handleTouchMove: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
};

export default Target;
