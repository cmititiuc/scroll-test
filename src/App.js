import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import './App.css';

const WIDTH = 800, HEIGHT = 757;

class App extends Component {
  constructor() {
    super();

    let scale = 1;

    if (WIDTH < window.innerWidth && HEIGHT >= window.innerHeight)
      scale = window.innerWidth / WIDTH;
    else if (HEIGHT < window.innerHeight && WIDTH >= window.innerWidth)
      scale = window.innerHeight / HEIGHT;
    else if (WIDTH < window.innerWidth && HEIGHT < window.innerHeight) {
      if (window.innerWidth - WIDTH > window.innerHeight - HEIGHT)
        scale = window.innerWidth / WIDTH;
      else
        scale = window.innerHeight / HEIGHT;
    }

    this.state = {
      top: 0,
      left: 0,
      scale: scale
    }
  }

  componentDidMount() {
    // window.addEventListener('resize', function() {
    //   console.log(window.innerWidth, window.innerHeight);
    // });
    const dragTarget = document.getElementById('dragable');
    const rootContainer = document.getElementById('container');

    console.log({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    });

    console.log(dragTarget.getBoundingClientRect());

    // Get the three major events
    let mouseup   = Rx.Observable.fromEvent(dragTarget,    'mouseup');
    let mousemove = Rx.Observable.fromEvent(rootContainer, 'mousemove');
    let mousedown = Rx.Observable.fromEvent(dragTarget,    'mousedown');

    let touchend   = Rx.Observable.fromEvent(dragTarget,    'touchend');
    let touchmove  = Rx.Observable.fromEvent(rootContainer, 'touchmove');
    let touchstart = Rx.Observable.fromEvent(dragTarget,    'touchstart');

    let mousedrag = mousedown.flatMap(md => {
      let rootRect = rootContainer.getBoundingClientRect();
      let dragTargetRect = dragTarget.getBoundingClientRect();

      // calculate offsets when mouse down
      let startX = md.clientX - dragTargetRect.left
        , startY = md.clientY - dragTargetRect.top
        ;

      // Calculate delta with mousemove until mouseup
      return mousemove.map(mm => {
        mm.preventDefault();

        let left = mm.clientX - rootRect.left - startX
          , top = mm.clientY - rootRect.top - startY
          ;

        let dtRect = dragTarget.getBoundingClientRect();

        if (left > 0) left = 0;
        if (left < window.innerWidth - dtRect.width)
          left = window.innerWidth - dtRect.width;
        if (top > 0) top = 0;
        if (top < window.innerHeight - dtRect.height)
          top = window.innerHeight - dtRect.height;

        return {
          left: left,
          top: top
        };
      }).takeUntil(mouseup);
    });

    let touchdrag = touchstart.flatMap(function(ts) {
      let targetTouches = ts.targetTouches[0];
      let rootRect = rootContainer.getBoundingClientRect();
      let dragTargetRect = dragTarget.getBoundingClientRect();

      let startX = targetTouches.clientX - dragTargetRect.left
        , startY = targetTouches.clientY - dragTargetRect.top
        ;

      return touchmove.map(function(tm) {
        tm.preventDefault();
        let targetTouches = tm.targetTouches[0];

        return {
          left: targetTouches.clientX - rootRect.left - startX,
          top: targetTouches.clientY - rootRect.top - startY
        }
      }).takeUntil(touchend);
    });

    let drag = Rx.Observable.merge(mousedrag, touchdrag);

    // Update position
    this.dragSubscription = drag.subscribe(pos => {
      this.setState({ top: pos.top, left: pos.left });
    });
  }

  componentWillUnmount() {
    this.dragSubscription.unsubscribe();
  }

  zoomIn = () => { this.setState({ scale: this.state.scale + 0.1 }); }
  zoomOut = () => { this.setState({ scale: this.state.scale - 0.1 }); }

  render() {
    const { top, left, scale } = this.state;

    return (
      <div id="container">
        <div id="zoom-buttons">
          <button onClick={this.zoomIn}>+</button>
          <button onClick={this.zoomOut}>-</button>
        </div>
        <div
          id="dragable"
          style={{top: top, left: left, transform: `scale(${scale})`}}
        >
        </div>
      </div>
    );
  }
}

export default App;
