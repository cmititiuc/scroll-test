import Rx from 'rxjs/Rx';
import { connect } from 'react-redux';
import Target from '../components/Target';
import { drag } from '../actions';

const onMount = dispatch => {
  const dragTarget = document.getElementById('target');
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

  let drags = Rx.Observable.merge(mousedrag, touchdrag);

  // Update position
  this.dragSubscription = drags.subscribe(
    pos => dispatch(drag({ top: pos.top, left: pos.left }))
  );
}

const mapStateToProps = state => ({
  top: state.top,
  left: state.left
});

const mapDispatchToProps = dispatch => ({
  onMount: () => onMount(dispatch),
  onUnmount: () => this.dragSubscription.unsubscribe()
});

const DraggableTarget = connect(
  mapStateToProps,
  mapDispatchToProps
)(Target);

export default DraggableTarget;
