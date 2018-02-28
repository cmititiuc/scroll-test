const drag = (state = { top: 0, left: 0 }, { type, pos }) => {
  switch (type) {
    case 'DRAG':
      return { top: pos.top, left: pos.left };
    default:
      return state;
  }
};

export default drag;
