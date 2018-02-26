import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      top: 0,
      left: 0
    }
  }

  componentDidMount() {
    const dragTarget = document.getElementById('dragable');
    const rootContainer = document.getElementById('root');

    // Get the three major events
    let mouseup   = Rx.Observable.fromEvent(dragTarget,    'mouseup');
    let mousemove = Rx.Observable.fromEvent(rootContainer, 'mousemove');
    let mousedown = Rx.Observable.fromEvent(dragTarget,    'mousedown');

    let touchend   = Rx.Observable.fromEvent(dragTarget,    'touchend');
    let touchmove  = Rx.Observable.fromEvent(rootContainer, 'touchmove');
    let touchstart = Rx.Observable.fromEvent(dragTarget,    'touchstart');

    let mousedrag = mousedown.flatMap(function (md) {
      let rootRect = rootContainer.getBoundingClientRect();
      let dragTargetRect = dragTarget.getBoundingClientRect();

      // calculate offsets when mouse down
      let startX = md.clientX - dragTargetRect.left
        , startY = md.clientY - dragTargetRect.top
        ;

      // Calculate delta with mousemove until mouseup
      return mousemove.map(function(mm) {
        mm.preventDefault();

        return {
          left: mm.clientX - rootRect.left - startX,
          top: mm.clientY - rootRect.top - startY
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

  render() {
    return (
      <div
        id="dragable"
        style={{top: this.state.top, left: this.state.left}}
      >
        <p>Touch/click and drag me</p>
        <p>
          On mobile, there should be no scroll-bounce at the edges
          and no refresh on pull-down
        </p>
      </div>
    );
  }
}

export default App;
