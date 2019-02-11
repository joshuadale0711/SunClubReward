import * as types from 'constants/ActionTypes';

const _defaultState = { current: '', history: []};

export default function (state = _defaultState, action) {
  switch (action.type) {
    case types.SET_ERRORS:
      // if there is no current error in store write it in current, if the cirrent errror already exists write prev erro in history (concat)
      return { ...state, current: action.error, history: state.errors && state.errors.current 
        ? state.errors.history 
          ? state.errors.history.concat(state.errors.current)
          : [state.errors.current]
        : {} };
    default:
      return state;
  }
}