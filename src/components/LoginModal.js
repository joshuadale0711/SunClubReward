import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native'

import { width, height } from 'constants/config'


export default class Login extends Component {
  
  render() {
    const { show, handleClose } = this.props
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={show}
        onRequestClose={() => {console.log("Modal has been closed.")}}>
        <TouchableWithoutFeedback 
          onPress={
            handleClose
              ? handleClose
              : null
          }>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalInner}>
                {this.props.children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalInner: {
    width: width(86),
    height: width(140),
    backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden'
  },
})