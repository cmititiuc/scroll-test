import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Target extends Component {
  constructor() {
    super();
    this.targetRefCallback = this.targetRefCallback.bind(this);
    this.containerRefCallback = this.containerRefCallback.bind(this);
  }

  componentDidMount() {
    this.dragSubscription =
      this.props.onMount(this.props.dispatch, this.target, this.container);
  }

  componentWillUnmount() {
    this.dragSubscription.unsubscribe();
  }

  containerRefCallback(el) {
    this.container = el;
  }

  targetRefCallback(el) {
    this.target = el;
  }

  render() {
    return (
      <div id="container" ref={this.containerRefCallback}>
        <div
          id="target"
          ref={this.targetRefCallback}
          style={{top: this.props.top, left: this.props.left}}
        >
          <p>Touch/click and drag me</p>
        </div>
      </div>
    )
  };
}

Target.propTypes = {
  onMount: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired
};

export default Target;
