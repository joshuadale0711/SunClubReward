import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, Keyboard, Alert } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, serverUrls, requiredList } from 'constants/config'
import { checkNextProps } from 'utils/index'

import fetchServ from 'actions/fetchServ'

import StdInput from 'components/StdInput'
import StdBtn from 'components/StdBtn'
import LogInNavBar from 'components/LogInNavBar'

@connect(
  state => ({
    forgotPassword: state.forgotPassword,
  }),
  dispatch => ({
    fetchForgotPassword: (params) => {
      dispatch(fetchServ(serverUrls.forgotPassword, params, 'FORGOTPASSWORD'))
    },
  })
)
export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    const singInFields = {
      login: '',
    }
    this.state = {
      singInFields,
      activeFieldName: '',
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const propsCheckerForgotPassword = checkNextProps(nextProps, this.props, 'forgotPassword')
    if (propsCheckerForgotPassword && propsCheckerForgotPassword != 'empty') {
      if (nextProps.forgotPassword.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.forgotPassword.response.msg)
        })
      } else {
        this.setState({isLoading: false})
      }
    } else if (propsCheckerForgotPassword == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }

  onSingInFieldsChange = (fieldName, value) => {
    const newSingInFields = this.state.singInFields
    newSingInFields[fieldName] = value
    this.setState({singInFields: newSingInFields})
  }

  sendPassword = () => {
    const { fetchForgotPassword } = this.props
    const { singInFields } = this.state
    Keyboard.dismiss()
    Object.values(singInFields).every(singInFieldValue => singInFieldValue) && this.setState({isLoading: true}, () => fetchForgotPassword(singInFields)) 
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
  
  render() {
    const { screenProps, navigation } = this.props
    const { singInFields, activeFieldName, isLoading } = this.state
    const { login } = singInFields
    const loginNavBarProps = {
      rightPart: {
        image: iconImages.loginCross,
        action: screenProps.handleClose
      },
      leftPart: {
        image: iconImages.loginBack,
        action: () => navigation.goBack()
      }
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <LogInNavBar {...loginNavBarProps} />  
          <View style={styles.topPartWrapper}>
            <Text style={styles.topPartText}>
              Forgot password?
            </Text>  
          </View>
          <View style={styles.mainContentWrapper}> 
            <StdInput
              placeholder={"E-mail"}
              onChangeText={(text) => this.onSingInFieldsChange('login', text)}
              value={login}
              autoCapitalize='none'
              onBlur={this.onBlur}
              onFocus={() => this.onFocus('login')}
              heighlighted={activeFieldName == 'login'}
              icon={'emailIcon'} /> 
            <View style={styles.singInBtnWrapper}>
              <StdBtn 
                disabled={!Object.keys(singInFields).every(singInFieldKey => requiredList['forgotPassword'].includes(singInFieldKey) 
                  ? !!singInFields[singInFieldKey]
                  : true
                )}   
                text="Send password"
                action={this.sendPassword}
                heightlighted={true} />  
            </View>
          </View>
        </KeyboardAwareScrollView>
        <BusyIndicator isVisible={isLoading} size="large"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topPartWrapper: {
    marginTop: width(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPartText: {
    fontSize: width(6.8)
  },
  mainContentWrapper: {
    marginTop: width(5),
    marginHorizontal: width(6)
  },
  singInBtnWrapper: {
    height: width(12),
    width: '100%',
    paddingHorizontal: width(1),
    marginTop: width(8)
  },
})