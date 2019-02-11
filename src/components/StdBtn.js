import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

import { width, height } from 'constants/config'

export default class StdBtn extends PureComponent {
  render() {
    const { text, heightlighted, action, width, disabled, error } = this.props
    return (
      <TouchableOpacity disabled={disabled} style={[
        styles.btnWrapper,
        width && {
          width: width
        },
      ]} onPress={action}>
        <View style={[
          styles.btnInner,
          heightlighted
            ? styles.heightlightedInner
            : styles.notHeightlightedInner,
          disabled && styles.disabledInner,
          error && styles.errorInner
        ]}>
          <Text style={[
            styles.btnText,
            heightlighted
              ? styles.heightlightedText
              : styles.notHeightlightedText
          ]} >
            {text}
          </Text>  
        </View>
      </TouchableOpacity>  
    );
  }
}

const styles = StyleSheet.create({
  btnWrapper: {
    width: '100%',
    height: '100%'
  },
  btnInner: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heightlightedInner: {
    backgroundColor: '#007DC6',
  },
  notHeightlightedInner: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3177A5'
  },
  disabledInner: {
    opacity: 0.4
  },
  errorInner: {
    backgroundColor: '#282C34'
  },
  heightlightedText: {
    color: 'white'
  },
  notHeightlightedText: {
    color: '#3177A5'
  },
  btnText: {
    fontSize: width(4.1)
  }
})