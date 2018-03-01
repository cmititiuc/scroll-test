import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Target extends Component {
  componentDidMount() {
    this.props.onMount(this.props.dispatch);
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  render() {
    return (
      <div id="target" style={{top: this.props.top, left: this.props.left}}>
        <p>Touch/click and drag me</p>
      </div>
    )
  };
}

Target.propTypes = {
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired
};

export default Target;
