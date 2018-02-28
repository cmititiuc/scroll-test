import { UPDATE_POSITION } from '../actions';

const initialState = {
  top: 0,
  left: 0
};

function position(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POSITION:
      return { top: action.pos.top, left: action.pos.left };
    default:
      return state;
  }
};

export default position;
