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


it('renders without crashing', () => {
  const [top, left] = [12, 34]
      , store = createStore(function() { return { top: top, left: left }})
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget />
          </Provider>
        )
      , target = wrapper.find('#container').find('#target')
      ;

  expect(target.exists()).toEqual(true);
  expect(target.instance().style.top).toEqual(top + 'px');
  expect(target.instance().style.left).toEqual(left + 'px');

  wrapper.unmount();
});

it('can move target with mouse', () => {
  const [top, left] = [0, 0]
      , store = createStore(Position)
      , wrapper = mount(
          <Provider store={store}>
            <DraggableTarget refCallback={e => e}/>
          </Provider>
        )
      , targetComp = wrapper.find(Target)
      , container = wrapper.find('#container')
      , target = container.find('#target')
      , initialPosition = { top: top + 'px', left: left + 'px' }
      , newPosition = { top: 54 + 'px', left: 87 + 'px' }
      , event = { clientX: 99, clientY: 88 }
      , position = function(comp) {
          const { top, left } = comp.instance().style;
          return { top: top, left: left };
        }
      ;

  expect(position(target)).toEqual(initialPosition);

  container.simulate('mousemove', { clientX: 99, clientY: 88 });

  // expect no change in position
  expect(position(target)).toEqual(initialPosition);

  target.simulate('mousedown', { clientX: 12, clientY: 34 });
  container.simulate('mousemove', event);
  target.simulate('mouseup');

  // expect position to have changed
  expect(position(target)).toEqual(newPosition);

  container.simulate('mousemove', { clientX: 99, clientY: 88 });

  // expect no change in position
  expect(position(target)).toEqual(newPosition);

  // console.log(wrapper.html());
  // console.log(store.getState());

  wrapper.unmount();
});
