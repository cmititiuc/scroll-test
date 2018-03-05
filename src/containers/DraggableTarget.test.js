import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount, unmount } from 'enzyme';
import Position from '../reducers/position';
import DraggableTarget from './DraggableTarget';
import Target from '../components/Target';

// setup
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


function getPosition(component) {
  const { top, left } = component.instance().style;
  return { top, left };
}

it('position matches state', () => {
  const [top, left] = [12, 34]
      , store = createStore(Position, { top, left })
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget />
          </Provider>
        )
      , target = wrapper.find('#container').find('#target')
      ;

  expect(target.exists()).toEqual(true);
  expect(getPosition(target)).toEqual({ top: top + 'px', left: left + 'px' });

  wrapper.unmount();
});

it('position updates when dragged with the mouse', () => {
  const [top, left] = [0, 0]
      , store = createStore(Position, { top, left })
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget />
          </Provider>
        )
      , targetComp = wrapper.find(Target)
      , container = wrapper.find('#container')
      , target = container.find('#target')
      , newPosition = { top: 54 + 'px', left: 87 + 'px' }
      , event = { clientX: 99, clientY: 88 }
      ;

  target.simulate('mousedown', { clientX: 12, clientY: 34 });
  container.simulate('mousemove', event);
  target.simulate('mouseup');

  // expect position to have changed
  expect(getPosition(target)).toEqual(newPosition);

  wrapper.unmount();
});

it("position does not update before a mousedown event", () => {
  const [top, left] = [0, 0]
      , store = createStore(Position, { top, left })
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget />
          </Provider>
        )
      , targetComp = wrapper.find(Target)
      , container = wrapper.find('#container')
      , target = container.find('#target')
      , newPosition = { top: 54 + 'px', left: 87 + 'px' }
      , event = { clientX: 99, clientY: 88 }
      ;

  container.simulate('mousemove', { clientX: 99, clientY: 88 });

  expect(getPosition(target)).toEqual({ top: top + 'px', left: left + 'px' });
});

it("position does not update after a mouseup event", () => {
  const [top, left] = [0, 0]
      , store = createStore(Position, { top, left })
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget />
          </Provider>
        )
      , targetComp = wrapper.find(Target)
      , container = wrapper.find('#container')
      , target = container.find('#target')
      , newPosition = { top: 54 + 'px', left: 87 + 'px' }
      , event = { clientX: 99, clientY: 88 }
      ;

  target.simulate('mousedown', { clientX: 12, clientY: 34 });
  container.simulate('mousemove', event);
  target.simulate('mouseup');
  container.simulate('mousemove', { clientX: 99, clientY: 88 });

  // expect no change in position after mouseup
  expect(getPosition(target)).toEqual(newPosition);

  wrapper.unmount();
});
