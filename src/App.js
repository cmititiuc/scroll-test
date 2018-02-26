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
    const dragTarget = document.getElementsByClassName('App')[0];
    const mapContainer = document.getElementById('root');

    // Get the three major events
    let mouseup   = Rx.Observable.fromEvent(dragTarget, 'mouseup');
    let mousemove = Rx.Observable.fromEvent(document,   'mousemove');
    let mousedown = Rx.Observable.fromEvent(dragTarget, 'mousedown');

    let touchend   = Rx.Observable.fromEvent(dragTarget, 'touchend');
    let touchmove  = Rx.Observable.fromEvent(document,   'touchmove');
    let touchstart = Rx.Observable.fromEvent(dragTarget, 'touchstart');

    let mousedrag = mousedown.flatMap(function (md) {
      let rect = mapContainer.getBoundingClientRect();
      let mapRect = dragTarget.getBoundingClientRect();

      // calculate offsets when mouse down
      let startX = md.clientX - mapRect.left
        , startY = md.clientY - mapRect.top
        ;

      // Calculate delta with mousemove until mouseup
      return mousemove.map(function(mm) {
        mm.preventDefault();

        return {
          left: mm.clientX - rect.left - startX,
          top: mm.clientY - rect.top - startY
        };
      }).takeUntil(mouseup);
    });

    let touchdrag = touchstart.flatMap(function(ts) {
      let targetTouches = ts.targetTouches[0];
      let rect = mapContainer.getBoundingClientRect();
      let mapRect = dragTarget.getBoundingClientRect();

      let startX = targetTouches.clientX - mapRect.left
        , startY = targetTouches.clientY - mapRect.top
        ;

      return touchmove.map(function(tm) {
        tm.preventDefault();
        let targetTouches = tm.targetTouches[0];

        return {
          left: targetTouches.clientX - rect.left - startX,
          top: targetTouches.clientY - rect.top - startY
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
      <div className="App" style={{top: this.state.top, left: this.state.left}}>
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
