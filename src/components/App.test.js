import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount, unmount } from 'enzyme';
import Position from '../reducers/position';
import App from './App';

it('renders without crashing', () => {
  const [top, left] = [12, 34]
      , store = createStore(Position, { top: top, left: left })
      , wrapper = mount(
          <Provider store={store}>
            <App />
          </Provider>
        )
      , target = wrapper.find('#container').find('#target')
      ;

  expect(target.exists()).toEqual(true);
  expect(target.instance().style.top).toEqual(top + 'px');
  expect(target.instance().style.left).toEqual(left + 'px');

  wrapper.unmount();
});
