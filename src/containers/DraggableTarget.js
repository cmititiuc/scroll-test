import { connect } from 'react-redux';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import Target from '../components/Target';
import { updatePosition } from '../actions';

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
// move$ - either a mouse move stream or a touch move stream
// terminus$ - either a mouse up stream or a touch end stream
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

// move$ - either a mouse move stream or a touch move stream
// terminus$ - either a mouse up stream or a touch end stream
function onMount(dispatch) {
  const { target, container } = this;
  this.mousedown$  = new Subject();
  this.mousemove$  = new Subject();
  this.mouseup$    = new Subject();
  this.touchstart$ = new Subject();
  this.touchend$   = new Subject();
  this.touchmove$  = new Subject();

  const callTransform = function(move$, terminus$) {
          return transformOrigin(target, container, move$, terminus$)
        }
      , mousedrag$ =
          this.mousedown$.mergeMap(callTransform(this.mousemove$, this.mouseup$))
      , touchdrag$ =
          this.touchstart$.mergeMap(callTransform(this.touchmove$, this.touchend$))
      , drag$ = merge(mousedrag$, touchdrag$)
      ;

  this.dragSubscription = drag$.subscribe(
    pos => dispatch(updatePosition({ top: pos.top, left: pos.left }))
  );
}

function onUnmount() {
  this.dragSubscription.unsubscribe();
}

function mapStateToProps({ top, left }) {
  return { top, left };
}

function mergeProps(stateProps, dispatchProps) {
  return { ...stateProps, ...dispatchProps, onMount, onUnmount,
    handleMouseDown: function(e) { return this.mousedown$.next(e) },
    handleMouseUp:   function(e) { return this.mouseup$.next(e) },
    handleMouseMove: function(e) { return this.mousemove$.next(e) },
    handleTouchStart: function(e) { return this.touchstart$.next(e) },
    handleTouchEnd:   function(e) { return this.touchend$.next(e) },
    handleTouchMove:  function(e) { return this.touchmove$.next(e) }
  };
}

const DraggableTarget = connect(
  mapStateToProps,
  null,
  mergeProps
)(Target);

export default DraggableTarget;
