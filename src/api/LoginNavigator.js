import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator } from 'react-navigation'

import SingIn from 'layouts/Login/SingIn'
import ForgotPassword from 'layouts/Login/ForgotPassword'
import ForgotNumber from 'layouts/Login/ForgotNumber'

import { addListener } from './ReduxStore'

const LoginNavigatorConfig = {
  headerMode: 'nine'
}

export const LoginNavigator = StackNavigator({
  SingIn: {
    screen: SingIn,
  },
  ForgotPassword: {
    screen: ForgotPassword,
  },
  ForgotNumber: {
    screen: ForgotNumber,
  },
}, LoginNavigatorConfig)

@connect(state => ({
  loginRoutes: state.loginRoutes
}))
export default class LoginWithNavigation extends Component {
  render() {
    const { dispatch, loginRoutes, appNavigationProps, handleClose } = this.props
    const navigationProps = addNavigationHelpers({
      dispatch,
      state: loginRoutes,
      addListener
    })
    return (
      <LoginNavigator
        screenProps={{appNavigationProps, handleClose}}
        navigation={navigationProps}/> 
    )
  }
}