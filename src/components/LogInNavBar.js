import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'

import { width, height } from 'constants/config'

export default class LogInNavBar extends Component {
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
    const { leftPart, centerPart, rightPart } = this.props
    return (
      <View style={styles.container}> 
        <View style={styles.leftPart}>
          {this.renderPart(leftPart)}
        </View>
        <View style={styles.centerPart}>
          {
            centerPart
              ? centerPart.comp
                ? centerPart.comp
                : <Text style={styles.centerPartText}>{centerPart.text}</Text>
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
    height: width(16),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width(5),
    alignItems: 'center',
  },
  leftPart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerPart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerPartText: {
    fontSize: width(5),
    height: '100%',
  },
  rightPart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImageWrapper: {
    height: width(4),
    width: width(4),
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  text: {
    fontSize: width(5)
  },
  btn: {
    padding: width(1)
  }
})