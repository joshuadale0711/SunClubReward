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
    changePassword: state.changePassword
  }),
  dispatch => ({
    fetchChangePassword: (params) => {
      dispatch(fetchServ(serverUrls.forgotPassword, params, 'CHANGEPASSWORD'))
    },
  })
)
export default class ChangePasswordTab extends Component {
  constructor(props) {
    super(props);
    const changePasswordFields = {
      oldPassword: '',
      newPassword: '',
      repeatPassword: ''
    }
    this.state = {
      changePasswordFields,
      activeFieldName: '',
      errorFieldName: '',
      errorMsg: '',
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const propsCheckerChangePassword = checkNextProps(nextProps, this.props, 'changePassword')
    if (propsCheckerChangePassword && propsCheckerChangePassword != 'empty') {
      this.setState({isLoading: false})
      if (nextProps.changePassword.response.msg != 'Password updated Failed.') {
        
      } else {
        this.setErrorMsg(nextProps.changePassword.response.msg)
      }
      if (nextProps.changePassword.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.changePassword.response.msg)
        })
      }
    } else if (propsCheckerChangePassword == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }

  onChangePasswordFieldsChange = (fieldName, value) => {
    const newChangePasswordFields = this.state.changePasswordFields
    newChangePasswordFields[fieldName] = value
    this.setState({changePasswordFields: newChangePasswordFields})
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

  changePassword = () => {
    const { fetchChangePassword, user } = this.props
    const { changePasswordFields } = this.state
    const userData = user && user.response && user.response.user_data
    const { oldPassword, newPassword, repeatPassword } = changePasswordFields
    Keyboard.dismiss()
    if (newPassword == repeatPassword) {
      if (oldPassword.length < 8 || repeatPassword.length < 8) {
        this.setErrorField('oldPassword')
        Alert.alert('Minimal password length is 8')
      } else {
        Keyboard.dismiss()
        userData && this.setState({isLoading: true}, () => {
          fetchChangePassword({
            ...changePasswordFields,
            user_id: userData.user_id,
            email: userData.email
          })
        })
      }
    } else {
      Alert.alert('New password do not match confitmation')
      this.setErrorField('repeatPassword')
    }
  }

  setErrorMsg = (msg) => {
    this.setState({ errorMsg: msg }, () => {
      setTimeout(() => {
        this.setState({errorMsg: ''})
      }, 3000)
    })
  }

  setErrorField = (errorFieldName) => {
    this.setState({ errorFieldName: errorFieldName }, () => {
      setTimeout(() => {
        this.setState({errorFieldName: ''})
      }, 5000)
    })
  }
  
  render() {
    const { changePasswordFields, activeFieldName, errorFieldName, errorMsg, isLoading } = this.state
    const { oldPassword, newPassword, repeatPassword } = changePasswordFields
    return (
      <View style={styles.container}>
        <View style={styles.inputsWrapper}>
          <StdInput
            placeholder={"Old password"}
            onChangeText={(text) => this.onChangePasswordFieldsChange('oldPassword', text)}
            value={oldPassword}
            onBlur={this.onBlur}
            secureTextEntry={true}
            onFocus={() => this.onFocus('oldPassword')}
            heighlighted={activeFieldName == 'oldPassword'}
            error={errorFieldName == 'oldPassword'}
            icon={'passwordIcon'} /> 
          <StdInput
            placeholder={"New password"}
            onChangeText={(text) => this.onChangePasswordFieldsChange('newPassword', text)}
            value={newPassword}
            onBlur={this.onBlur}
            secureTextEntry={true}
            onFocus={() => this.onFocus('newPassword')}
            heighlighted={activeFieldName == 'newPassword'}
            error={errorFieldName == 'newPassword'}
            icon={'passwordIcon'} /> 
          <StdInput
            placeholder={"Confirm password"}
            onChangeText={(text) => this.onChangePasswordFieldsChange('repeatPassword', text)}
            value={repeatPassword}
            onBlur={this.onBlur}
            secureTextEntry={true}
            onFocus={() => this.onFocus('repeatPassword')}
            heighlighted={activeFieldName == 'repeatPassword'}
            error={errorFieldName == 'repeatPassword'}
            icon={'passwordIcon'} /> 
        </View>
        <View style={styles.btnWrapper}>
          <StdBtn 
            error={errorMsg}
            disabled={!Object.keys(changePasswordFields).every(changePasswordFieldKey => requiredList['changePassword'].includes(changePasswordFieldKey) 
              ? !!changePasswordFields[changePasswordFieldKey]
              : true
            )}   
            text="Change password"
            action={this.changePassword}
            heightlighted={true} />  
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
})