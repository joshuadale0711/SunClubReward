import React, { Component } from 'react'
import { Platform, AppState } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import axios from 'axios'

import Store, {persistor} from 'api/ReduxStore'
import AppWithNavigationState from 'api/AppNavigator'

import { baseUrl } from 'constants/config'


export default class ListenOnRepeat extends Component {
  constructor(props) {
    super(props);
    axios.defaults.baseURL = baseUrl;
    axios.defaults.timeout = 10000;
    this.state = {
    }
  }

  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
            <AppWithNavigationState />
        </Provider>
      </PersistGate>
    );
  }
}