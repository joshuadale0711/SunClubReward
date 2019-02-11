import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, Keyboard, Alert } from 'react-native'
import { connect } from 'react-redux'
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, serverUrls, requiredList } from 'constants/config'
import { checkNextProps } from 'utils/index'

import fetchServ from 'actions/fetchServ'

import StdInput from 'components/StdInput'
import StdBtn from 'components/StdBtn'

@connect(
  state => ({
    user: state.user,
    changePinCode: state.changePinCode
  }),
  dispatch => ({
    fetchChangePinCode: (params) => {
      dispatch(fetchServ(serverUrls.changePinCode, params, 'CHANGEPINCODE'))
    },
    fetchForgetPinCode: (params) => {
      dispatch(fetchServ(serverUrls.forgotPinCode, params, 'FORGETPINCODE'))
    },
  })
)
export default class ChangePinCodeTab extends Component {
  constructor(props) {
    super(props);
    const changePinCodeFields = {
      oldPinCode: '',
      newPinCode: '',
      confirmPinCode: ''
    }
    this.state = {
      changePinCodeFields,
      activeFieldName: '',
      errorFieldName: '',
      errorMsg: '',
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const propsCheckerChangePinCode = checkNextProps(nextProps, this.props, 'changePinCode')
    if (propsCheckerChangePinCode && propsCheckerChangePinCode != 'empty') {
      this.setState({isLoading: false})
      if (nextProps.changePinCode.response.msg != 'PinCode updated Failed.') {

      } else {
        this.setErrorMsg(nextProps.changePinCode.response.msg)
      }
      if (nextProps.changePinCode.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.changePinCode.response.msg)
        })
      }
    } else if (propsCheckerChangePinCode == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }

  setErrorMsg = (msg) => {
    this.setState({ errorMsg: msg }, () => {
      setTimeout(() => {
        this.setState({errorMsg: ''})
      }, 3000)
    })
  }

  onChangePinCodeFieldsChange = (fieldName, value) => {
    const newChangePinCodeFields = this.state.changePinCodeFields
    newChangePinCodeFields[fieldName] = value
    this.setState({changePinCodeFields: newChangePinCodeFields})
  }

  onBlur = () => {
    this.setState({ activeFieldName: ''})
  }

  onFocus = (fieldName) => {
    const { errorFieldName } = this.state
    this.setState({
      activeFieldName: fieldName,
      errorFieldName: errorFieldName == fieldName
        ? ''
        : errorFieldName
    })
  }
  
  setErrorField = (errorFieldName) => {
    this.setState({ errorFieldName: errorFieldName }, () => {
      setTimeout(() => {
        this.setState({errorFieldName: ''})
      }, 5000)
    })
  }

  changePinCode = () => {
    const { fetchChangePinCode, user } = this.props
    const { changePinCodeFields } = this.state
    const { oldPinCode, newPinCode, confirmPinCode } = changePinCodeFields
    const userData = user && user.response && user.response.user_data
    Keyboard.dismiss()
    if (newPinCode == confirmPinCode) {
      if (oldPinCode.length < 4 || confirmPinCode.length < 4) {
        this.setErrorField('oldPinCode')
        Alert.alert('Minimal pin code length is 4')
      } else {
        userData && this.setState({isLoading: true}, () => {
          fetchChangePinCode({
            ...changePinCodeFields,
            user_id: userData.user_id,
            email: userData.email
          })
        })
      }
    } else {
      Alert.alert('New pin code do not match confitmation')
      this.setErrorField('confirmPinCode')
    }
  }

  forgetPinCode = () => {
    const { user, fetchForgetPinCode } = this.props
    const userData = user && user.response && user.response.user_data
    userData && this.setState({isLoading: true}, () => {
      userData && fetchForgetPinCode({
        user_id: userData.user_id,
        email: userData.email
      })
    })
  }
  
  render() {
    const { changePinCodeFields, activeFieldName, errorFieldName, errorMsg, isLoading } = this.state
    const { oldPinCode, newPinCode, confirmPinCode } = changePinCodeFields
    return (
      <View style={styles.container}>
        <View style={styles.inputsWrapper}>
          <StdInput
            placeholder={"Old PIN"}
            onChangeText={(text) => this.onChangePinCodeFieldsChange('oldPinCode', text)}
            value={oldPinCode}
            onBlur={this.onBlur}
            secureTextEntry={true}
            onFocus={() => this.onFocus('oldPinCode')}
            heighlighted={activeFieldName == 'oldPinCode'}
            error={errorFieldName == 'oldPinCode'}
            icon={'passwordIcon'} /> 
          <StdInput
            placeholder={"New PIN"}
            onChangeText={(text) => this.onChangePinCodeFieldsChange('newPinCode', text)}
            value={newPinCode}
            onBlur={this.onBlur}
            secureTextEntry={true}
            onFocus={() => this.onFocus('newPinCode')}
            heighlighted={activeFieldName == 'newPinCode'}
            error={errorFieldName == 'newPinCode'}
            icon={'passwordIcon'} /> 
          <StdInput
            placeholder={"Confirm PIN"}
            onChangeText={(text) => this.onChangePinCodeFieldsChange('confirmPinCode', text)}
            value={confirmPinCode}
            onBlur={this.onBlur}
            secureTextEntry={true}
            onFocus={() => this.onFocus('confirmPinCode')}
            heighlighted={activeFieldName == 'confirmPinCode'}
            error={errorFieldName == 'confirmPinCode'}
            icon={'passwordIcon'} /> 
        </View>
        <View style={styles.btnWrapper}>
          <StdBtn 
            text="Change PIN"
            error={errorMsg}
            disabled={!Object.keys(changePinCodeFields).every(changePinCodeFieldKey => requiredList['changePinCode'].includes(changePinCodeFieldKey) 
              ? !!changePinCodeFields[changePinCodeFieldKey]
              : true
            )} 
            action={this.changePinCode}
            heightlighted={true} />
          <View style={styles.forgotBtnWrapper}>
            <TouchableOpacity onPress={this.forgetPinCode}>
              <Text style={styles.forgotBtnText}>
                Forgot your PIN?
              </Text>
            </TouchableOpacity>  
          </View>  
        </View>
        <BusyIndicator isVisible={isLoading} size="large"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputsWrapper: {
    marginTop: width(5),
    marginHorizontal: width(8)
  },
  btnWrapper: {
    height: width(12),
    width: '100%',
    paddingHorizontal: width(8),
    marginTop: width(8)
  },
  forgotBtnWrapper: {
    marginTop: width(4),
    alignItems: 'center',
    justifyContent: 'center'
  },
  forgotBtnText: {
    fontSize: width(5)
  }
})