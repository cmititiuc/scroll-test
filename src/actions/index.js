/*
 * action types
 */

export const UPDATE_POSITION = 'UPDATE_POSITION';

/*
 * action creators
 */

export function updatePosition(pos) {
  return { type: UPDATE_POSITION, pos }
};
