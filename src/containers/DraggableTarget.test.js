import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount, unmount } from 'enzyme';
import Position from '../reducers/position';
import DraggableTarget from './DraggableTarget';
import Target from '../components/Target';

function getPosition(component) {
  const { top, left } = component.instance().style;
  return { top, left };
}

function setup(propOverrides) {
  const props = { top: 0, left: 0, ...propOverrides }
      , store = createStore(Position, { top: props.top, left: props.left })
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget />
          </Provider>
        )
      , container = wrapper.find('#container')
      , target = container.find('#target')
      ;

  return { props, wrapper, store, container, target };
}

it('matches position to state', () => {
  const [top, left] = [12, 34]
      , { target, wrapper } = setup({ top, left })
      ;

  expect(target.exists()).toEqual(true);
  expect(getPosition(target)).toEqual({ top: top + 'px', left: left + 'px' });

  wrapper.unmount();
});

describe('mouse drag', () => {
  it('updates position when dragged with the mouse', () => {
    const { target, wrapper, container } = setup()
        , newPosition = { top: 32 + 'px', left: 11 + 'px' }
        , mousedownEvent = { clientX: 1, clientY: 2 }
        , mousemoveEvent = { clientX: 12, clientY: 34 }
        ;

    target.simulate('mousedown', mousedownEvent);
    container.simulate('mousemove', mousemoveEvent);
    target.simulate('mouseup');

    expect(getPosition(target)).toEqual(newPosition);

    wrapper.unmount();
  });

  it("does not update position before a mousedown event", () => {
    const { target, wrapper, container, props: { top, left }} = setup()
        , startingPosition = { top: top + 'px', left: left + 'px' }
        , mousemoveEvent = { clientX: 12, clientY: 34 }
        ;

    container.simulate('mousemove', mousemoveEvent);

    expect(getPosition(target)).toEqual(startingPosition);

    wrapper.unmount();
  });

  it("does not update position after a mouseup event", () => {
    const { target, wrapper, container } = setup()
        , endingPosition = { top: 32 + 'px', left: 11 + 'px' }
        , mousedownEvent = { clientX: 1, clientY: 2 }
        , mousemoveFirstEvent = { clientX: 12, clientY: 34 }
        , mousemoveSecondEvent = { clientX: 42, clientY: 404 }
        ;

    expect(mousemoveFirstEvent).not.toEqual(mousemoveSecondEvent);

    target.simulate('mousedown', mousedownEvent);
    container.simulate('mousemove', mousemoveFirstEvent);
    target.simulate('mouseup');
    container.simulate('mousemove', mousemoveSecondEvent);

    expect(getPosition(target)).toEqual(endingPosition);

    wrapper.unmount();
  });
});

describe('touch drag', () => {
  it('updates position when dragged with touch', () => {
    const { target, wrapper, container } = setup()
        , newPosition = { top: 32 + 'px', left: 11 + 'px' }
        , touchstartEvent = { clientX: 1, clientY: 2 }
        , touchmoveEvent = { clientX: 12, clientY: 34 }
        ;

    target.simulate('touchstart', touchstartEvent);
    container.simulate('touchmove', touchmoveEvent);
    target.simulate('touchend');

    expect(getPosition(target)).toEqual(newPosition);

    wrapper.unmount();
  });

  it("does not update position before a touchstart event", () => {
    const { target, wrapper, container, props: { top, left }} = setup()
        , startingPosition = { top: top + 'px', left: left + 'px' }
        , touchmoveEvent = { clientX: 12, clientY: 34 }
        ;

    container.simulate('touchmove', touchmoveEvent);

    expect(getPosition(target)).toEqual(startingPosition);

    wrapper.unmount();
  });

  it("does not update position after a touchend event", () => {
    const { target, wrapper, container } = setup()
        , endingPosition = { top: 32 + 'px', left: 11 + 'px' }
        , touchstartEvent = { clientX: 1, clientY: 2 }
        , touchmoveFirstEvent = { clientX: 12, clientY: 34 }
        , touchmoveSecondEvent = { clientX: 42, clientY: 404 }
        ;

    expect(touchmoveFirstEvent).not.toEqual(touchmoveSecondEvent);

    target.simulate('touchstart', touchstartEvent);
    container.simulate('touchmove', touchmoveFirstEvent);
    target.simulate('touchend');
    container.simulate('touchmove', touchmoveSecondEvent);

    expect(getPosition(target)).toEqual(endingPosition);

    wrapper.unmount();
  });
});
