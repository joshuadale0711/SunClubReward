import { NavigationActions } from 'react-navigation';

import { LoginNavigator } from 'api/LoginNavigator';
const mainSceneAction = LoginNavigator.router.getActionForPathAndParams('SingIn');
const initialStateMain = LoginNavigator.router.getStateForAction(mainSceneAction);

const initialNavState = LoginNavigator.router.getStateForAction(
  initialStateMain,
);

export default function (state = initialNavState, action = {}) {
  return LoginNavigator.router.getStateForAction(action, state) || state
}