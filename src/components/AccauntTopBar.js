import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import { connect } from 'react-redux'

import { height, width, iconImages, accountTopBarButtons } from 'constants/config'
import { checkNextProps } from 'utils'

@connect(
  state => ({
  }),
  dispatch => ({
  })
)
export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  generateButtons = () => {
    const { handleBtnPress, activeAction } = this.props
    return accountTopBarButtons.map((btnItem, idx) => {
      const isActive = activeAction
        ? activeAction == btnItem.action
        : idx == 0
      return (
        <View key={'accountTopBarButton_' + btnItem.action} styele={[styles.btnWrapper, isActive && styles.btnWrapperActive]}>
          <TouchableOpacity onPress={
            handleBtnPress
              ? () => handleBtnPress(btnItem.action)
              : null
          }>
            <View style={[styles.btnInner, isActive && styles.btnInnerActive]}>
              <Text style={[styles.btnText, isActive && styles.btnTextActive]}>
                {btnItem.text}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )  
    })
  }
  
  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        {this.generateButtons()}
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width(6)
  },
  btnWrapper: {

  },
  btnWrapperActive: {

  },
  btnInner: {
    paddingVertical: width(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInnerActive: {
    borderBottomWidth: 1,
    borderBottomColor: '#FAB864',
    borderStyle: 'solid'
  },
  btnText: {
    fontSize: width(4.2),
    color: '#C3C3C3'
  },
  btnTextActive: {
    color: '#FAB864'
  }
})
