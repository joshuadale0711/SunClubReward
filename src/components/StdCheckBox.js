import React, { Component, PureComponent } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native'

import { height, width, iconImages } from 'constants/config'

export default class StdCheckBox extends PureComponent {
  render() {
    const { state, text, onPress, wrapperCustomStyle } = this.props
    return (
      <View style={[styles.checkBoxWrapper, wrapperCustomStyle]}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.checkBoxInner}>
            <View style={styles.checkBoxImageWrapper}>
              <Image
                source={
                  state
                    ? iconImages.checkBoxActiveIcon
                    : iconImages.checkBoxIcon
                }  
                style={styles.checkBoxImage} />
            </View>
            <Text style={styles.text}>
              {text}
            </Text>
          </View>  
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkBoxWrapper: {

  },
  checkBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkBoxImageWrapper: {
    width: width(6),
    height: width(6)
  },
  checkBoxImage: {
    width: '100%',
    height: '100%'
  },
  text: {
    marginLeft: width(3),
    fontSize: width(4)
  }
})