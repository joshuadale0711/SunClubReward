import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import Spinner from 'react-native-spinkit'

import { width, height } from 'constants/config'

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          style={styles.spinner}
          isVisible={true}
          size={
            Platform.OS == 'ios'
              ? width(28)
              : width(22)
          }
          type={'Circle'}
          color={'#FFFFFF'} />  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner: {
    alignSelf: 'center'
  }
})