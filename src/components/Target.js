import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Target extends Component {
  constructor(props) {
    super(props);

    this.refCallback = props.refCallback.bind(this);
    this.onMount = props.onMount.bind(this);
    this.onUnmount = props.onUnmount.bind(this);
  }

  componentDidMount() {
    this.onMount(this.props.dispatch, this.target, this.container)();
  }

  componentWillUnmount() {
    this.onUnmount();
  }

  render() {
    return (
      <div id="container" ref={this.refCallback('container')}>
        <div
          id="target"
          ref={this.refCallback('target')}
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
  dispatch: PropTypes.func,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired
};

export default Target;
