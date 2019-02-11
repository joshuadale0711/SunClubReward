import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Easing, Animated, Keyboard, SafeAreaView, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator, DrawerNavigator } from 'react-navigation'
import Orientation from 'react-native-orientation';

import CustomDrawerContentComponent from 'components/CustomDrawerContentComponent'

import { width, height, createTableQuery, isIphoneX } from 'constants/config'
import store, { addListener } from './ReduxStore'

// Imports for app routes
import Main from 'layouts/Main'
import Login from 'layouts/Login'
import FAQ from 'layouts/FAQ'
import Statements from 'layouts/Statements'
import Card from 'layouts/Card'
import Profile from 'layouts/Profile'
import Register1 from 'layouts/Register1'
import Register2 from 'layouts/Register2'

const DrawerNavigatorConfig = {
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerWidth: width(80),
  drawerPosition: 'left',
  drawerBackgroundColor: 'transparent',
  initialRouteName: 'Login',
  contentComponent: props => <CustomDrawerContentComponent {...props} />,
}

export const AppNavigator = DrawerNavigator({
  Login: {
    screen: Login,
  },
  Main: {
    screen: Main,
  },
  FAQ: {
    screen: FAQ
  },
  Profile: {
    screen: Profile
  },
  Statements: {
    screen: Statements
  },
  Card: {
    screen: Card
  },
  Register1: {
    screen: Register1
  },
  Register2: {
    screen: Register2
  }
}, DrawerNavigatorConfig)

@connect(state => ({
  routes: state.routes
}))
export default class AppWithNavigationState extends Component {
  componentWillMount() {
    Orientation.lockToPortrait()
  }
  render() {
    const { dispatch, routes } = this.props
    const navigationProps = addNavigationHelpers({
      dispatch,
      state: routes,
      addListener
    })
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          barStyle={isIphoneX() ? 'light-content' : 'default' }/>  
        <AppNavigator
          navigation={navigationProps} /> 
      </View>
    )
  }
}

