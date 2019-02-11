import * as types from 'constants/ActionTypes';

export const setSettings = (data) => {
  return {
    type: types.SET_SETTINGS,
    data,
  }
};

export const resetSettings = () => {
  return { type: types.RESET_SETTINGS };
};
