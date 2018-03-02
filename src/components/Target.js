import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Target extends Component {
  constructor(props) {
    super(props);

    this.targetRefCallback = props.targetRefCallback().bind(this);
    this.containerRefCallback = props.containerRefCallback().bind(this);
  }

  componentDidMount() {
    const { onMount } = this.props;
    onMount(this.props.dispatch, this.target, this.container).bind(this)();
  }

  componentWillUnmount() {
    this.dragSubscription.unsubscribe();
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
