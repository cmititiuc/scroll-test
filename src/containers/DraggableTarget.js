import { connect } from 'react-redux';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import Target from '../components/Target';
import { updatePosition } from '../actions';

function createMouseObs(dragTarget, rootContainer) {
  return {
    mouseup$:   fromEvent(dragTarget,    'mouseup'),
    mousemove$: fromEvent(rootContainer, 'mousemove'),
    mousedown$: fromEvent(dragTarget,    'mousedown')
  }
}

function createTouchObs(dragTarget, rootContainer) {
  return {
    touchend$:   fromEvent(dragTarget,    'touchend'),
    touchmove$:  fromEvent(rootContainer, 'touchmove'),
    touchstart$: fromEvent(dragTarget,    'touchstart')
  }
}

// moveEvent - either a mouse move event or a touch move event
function transformMove(rootRect, startX, startY) {
  return function(moveEvent) {
    moveEvent.preventDefault();
    const move = moveEvent.targetTouches ? moveEvent.targetTouches[0] : moveEvent;

    return {
      top: move.clientY - rootRect.top - startY,
      left: move.clientX - rootRect.left - startX
    }
  }
}

// originEvent - either a mouse down event or a touch start event
// move - either a mouse move stream or a touch move stream
// terminus - either a mouse up stream or a touch end stream
function transformOrigin(dragTarget, rootContainer, move$, terminus$) {
  return function(originEvent) {
    const origin = originEvent.targetTouches ? originEvent.targetTouches[0] : originEvent
        , rootRect = rootContainer.getBoundingClientRect()
        , dragTargetRect = dragTarget.getBoundingClientRect()
        , startX = origin.clientX - dragTargetRect.left
        , startY = origin.clientY - dragTargetRect.top
        ;

    return move$.map(transformMove(rootRect, startX, startY)).takeUntil(terminus$);
  }
}

function onMount(dispatch, target, container, mousedown, mouseup, mousemove) {
  // const { mouseup$, mousemove$, mousedown$ }   = createMouseObs(target, container)
  const { touchend$, touchmove$, touchstart$ } = createTouchObs(target, container)
      , callTransform = function(move$, terminus$) {
          return transformOrigin(target, container, move$, terminus$)
        }
      , mousedrag$ = mousedown.mergeMap(callTransform(mousemove, mouseup))
      , touchdrag$ = touchstart$.mergeMap(callTransform(touchmove$, touchend$))
      , drag$ = merge(mousedrag$, touchdrag$)
      ;

  return (() => {
    this.dragSubscription = drag$.subscribe(
      pos => dispatch(updatePosition({ top: pos.top, left: pos.left }))
    );
  });
}

function onUnmount() {
  return (() => this.dragSubscription.unsubscribe());
}

function refCallback(name) {
  return (element => this[name] = element);
}

function mapStateToProps({ top, left }) {
  return { top, left };
}

function mergeProps(stateProps, dispatchProps) {
  return { ...stateProps, ...dispatchProps,
    onMount, onUnmount, refCallback,
    mousedown: () => (new Subject()),
    mouseup: () => (new Subject()),
    mousemove: () => (new Subject())
  };
}

const DraggableTarget = connect(
  mapStateToProps,
  null,
  mergeProps
)(Target);

export default DraggableTarget;
