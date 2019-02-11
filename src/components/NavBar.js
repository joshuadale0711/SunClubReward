import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Platform } from 'react-native'

import { height, width, isIphoneX } from 'constants/config'


export default class NavBar extends Component {
  renderPart = (part) => {
    if (part) {
      if (part.comp) {
        return part.comp
      } else if (part.icon) {
        return (
          <TouchableOpacity style={styles.btn} onPress={part.action}>  
            {part.icon}
          </TouchableOpacity>
        )
      } else if (part.image) {
        return (
          <TouchableOpacity style={styles.btn} onPress={part.action}>  
            <View style={[styles.iconImageWrapper, part.imageWrapperCustomStyle]}>
              <Image
                source={part.image}
                style={styles.iconImage} />
            </View>  
          </TouchableOpacity>
        )
      } else if (part.text) {
        return (
          <TouchableOpacity style={styles.btn} onPress={part.action}>  
            <Text style={styles.text}>
              {part.text}
            </Text>  
          </TouchableOpacity>
        )
      }
    }
    return null
  }

  render() {
    const { navigation } = this.props
    const { leftPart, centerPart, rightPart } = this.props
    console.log(isIphoneX())
    return (
      <View style={[styles.container, isIphoneX() && {paddingTop: width(10)} ]}> 
        <StatusBar backgroundColor="#007DC6" />  
        <View style={styles.leftPart}>
          {this.renderPart(leftPart)}
        </View>
        <View style={styles.centerPart}>
          {
            centerPart
              ? centerPart.comp
                ? centerPart.comp
                : <Text style={[styles.centerPartText, centerPart.fontSize && {fontSize: centerPart.fontSize}]}>{centerPart.text}</Text>
              : null
          }
        </View>
        <View style={styles.rightPart}>
          {this.renderPart(rightPart)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios'
      ? isIphoneX()
        ? width(24)
        : width(20)
      : width(14),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width(4),
    alignItems: 'center',
    backgroundColor: '#007DC6',
    paddingTop: Platform.OS == 'ios'
      ? width(6)
      : width(2)
  },
  leftPart: {
    width: width(15),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerPart: {
    width: width(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPartText: {
    fontSize: width(5),
    color: 'white',
  },
  rightPart: {
    width: width(15),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconImageWrapper: {
    height: width(6),
    width: width(6),
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  text: {
    fontSize: width(4.2),
    color: 'white'
  },
  btn: {
    padding: width(1)
  }
})
