import * as types from 'constants/ActionTypes';

const _defaultState = { };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SET_SETTINGS:
			return { ...state, ...action.data };
		case types.RESET_SETTINGS:
			return { ..._defaultState };
		default:
			return state;
	}
}