import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Target extends Component {
  constructor(props) {
    super(props);

    this.onMount = props.onMount.bind(this);
    this.onUnmount = props.onUnmount.bind(this);
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
        onMouseMove={e => this.mousemove.next(e)}
        onTouchMove={e => this.touchmove.next(e)}
      >
        <div
          id="target"
          ref={el => this.target = el}
          onMouseDown={e => this.mousedown.next(e)}
          onMouseUp={e => this.mouseup.next(e)}
          onTouchStart={e => this.touchstart.next(e)}
          onTouchEnd={e => this.touchend.next(e)}
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
