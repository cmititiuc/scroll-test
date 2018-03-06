import { connect } from 'react-redux';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import Target from '../components/Target';
import { updatePosition } from '../actions';

function initializeSubjects() {
  this.mousedown$  = new Subject();
  this.mousemove$  = new Subject();
  this.mouseup$    = new Subject();

  this.touchstart$ = new Subject();
  this.touchmove$  = new Subject();
  this.touchend$   = new Subject();
}

// moveEvent - either a mouse move event or a touch move event
function transformMove(rootRect, startX, startY) {
  return function(moveEvent) {
    moveEvent.preventDefault();
    const move = moveEvent.targetTouches ? moveEvent.targetTouches[0] : moveEvent

    return {
      top: move.clientY - rootRect.top - startY,
      left: move.clientX - rootRect.left - startX
    }
  }
}

// originEvent - either a mouse down event or a touch start event
// move$ - either a mouse move stream or a touch move stream
// terminus$ - either a mouse up stream or a touch end stream
function transformOrigin(container, move$, terminus$) {
  return function(originEvent) {
    const origin = originEvent.targetTouches ? originEvent.targetTouches[0] : originEvent
        , rootRect = container.getBoundingClientRect()
        , dragTargetRect = originEvent.target.getBoundingClientRect()
        , startX = origin.clientX - dragTargetRect.left
        , startY = origin.clientY - dragTargetRect.top
        ;

    return move$.map(transformMove(rootRect, startX, startY)).takeUntil(terminus$);
  }
}

function onMount(dispatch) {
  initializeSubjects.bind(this)();

  const { mousedown$, mousemove$, mouseup$, touchstart$, touchmove$, touchend$,
          container
        } = this
      , mousedrag$ = mousedown$.mergeMap(
          transformOrigin(container, mousemove$, mouseup$)
        )
      , touchdrag$ = touchstart$.mergeMap(
          transformOrigin(container, touchmove$, touchend$)
        )
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
