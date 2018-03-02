import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount } from 'enzyme';
import App from './App';


// setup
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const store = createStore(function() { return { top: 0, left: 0 }});
  const wrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>
  );

  console.log(wrapper.html());
});
