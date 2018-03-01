import { connect } from 'react-redux';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import Target from '../components/Target';
import { updatePosition } from '../actions';

function createMouseObs(dragTarget, rootContainer) {
  return {
    mouseup:   fromEvent(dragTarget,    'mouseup'),
    mousemove: fromEvent(rootContainer, 'mousemove'),
    mousedown: fromEvent(dragTarget,    'mousedown')
  }
}

function createTouchObs(dragTarget, rootContainer) {
  return {
    touchend:   fromEvent(dragTarget,    'touchend'),
    touchmove:  fromEvent(rootContainer, 'touchmove'),
    touchstart: fromEvent(dragTarget,    'touchstart')
  }
}

function transformMove(rootRect, startX, startY) {
  return function(moveEvent) {
    moveEvent.preventDefault();
    const move = moveEvent.targetTouches ? moveEvent.targetTouches[0] : moveEvent;

    return {
      left: move.clientX - rootRect.left - startX,
      top: move.clientY - rootRect.top - startY
    }
  }
}

function transformOrigin(dragTarget, rootContainer, move, terminus) {
  return function(originEvent) {
    const origin = originEvent.targetTouches ? originEvent.targetTouches[0] : originEvent
        , rootRect = rootContainer.getBoundingClientRect()
        , dragTargetRect = dragTarget.getBoundingClientRect()
        , startX = origin.clientX - dragTargetRect.left
        , startY = origin.clientY - dragTargetRect.top
        ;

    return move.map(transformMove(rootRect, startX, startY)).takeUntil(terminus);
  }
}

const onMount = dispatch => {
  const dragTarget    = document.getElementById('target')
      , rootContainer = document.getElementById('root')
      , { mouseup, mousemove, mousedown }   = createMouseObs(dragTarget, rootContainer)
      , { touchend, touchmove, touchstart } = createTouchObs(dragTarget, rootContainer)
      , callTransform = function(move, terminus) {
          return transformOrigin(dragTarget, rootContainer, move, terminus)
        }
      , mousedrag = mousedown.mergeMap(callTransform(mousemove, mouseup))
      , touchdrag = touchstart.mergeMap(callTransform(touchmove, touchend))
      , drag = merge(mousedrag, touchdrag)
      ;

  this.dragSubscription = drag.subscribe(
    pos => dispatch(updatePosition({ top: pos.top, left: pos.left }))
  );
}

const mapStateToProps = ({ top, left }) => (
  { top, left }
);

const mapDispatchToProps = dispatch => ({
  onMount: () => onMount(dispatch),
  onUnmount: () => this.dragSubscription.unsubscribe()
});

const DraggableTarget = connect(
  mapStateToProps,
  mapDispatchToProps
)(Target);

export default DraggableTarget;
