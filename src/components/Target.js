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
      <div
        id="target"
        style={{top: this.props.top, left: this.props.left}}
      >
        <p>Touch/click and drag me</p>
        <p>
          On mobile, there should be no scroll-bounce at the edges
          and no refresh on pull-down
        </p>
      </div>
    )
  };
}

Target.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired
};

export default Target;
