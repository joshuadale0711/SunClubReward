import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, Keyboard, Alert } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, serverUrls, requiredList } from 'constants/config'

import { checkNextProps } from 'utils/index'
import fetchServ from 'actions/fetchServ'
import { setSettings } from 'actions/utils'

import StdInput from 'components/StdInput'
import StdBtn from 'components/StdBtn'
import LogInNavBar from 'components/LogInNavBar'
import StdCheckBox from 'components/StdCheckBox'
import Loading from 'components/Loading'

@connect(
  state => ({
    settings: state.settings,
    login: state.login,
    user: state.user
  }),
  dispatch => ({
    fetchSingin: (params) => {
      dispatch(fetchServ(serverUrls.login, params, 'LOGIN'))
    },
    fetchGetUser: (params) => {
      dispatch(fetchServ(serverUrls.getUser, params, 'USER'))
    },
    setSettings: (data) => {
      dispatch(setSettings(data))
    },
  })
)
export default class SingIn extends Component {
  constructor(props) {
    super(props);
    const singInFields = {
      login: props.settings && props.settings.rememberLogin
        ? props.user && props.user.response && props.user.response.user_data && props.user.response.user_data.email || ''
        : '',
      password: '',
      remember: props.settings && props.settings.rememberLogin || false
    }
    this.state = {
      singInFields,
      activeFieldName: '',
      isLoading: false,
      errorMsg: ''
    }
  }

  onSingInFieldsChange = (fieldName, value) => {
    const newSingInFields = this.state.singInFields
    newSingInFields[fieldName] = value
    this.setState({singInFields: newSingInFields})
  }

  singIn = () => {
    const { fetchSingin } = this.props
    const { singInFields } = this.state
    const { password } = singInFields
    if (password.length < 8) {
      this.setErrorField('password')
      Alert.alert('Minimal password length is 8')
    } else {
      this.setState({ isLoading: true }, () => {
        Keyboard.dismiss()
        fetchSingin(singInFields)
      })
    }
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

  handleRememberPress = () => {
    this.onSingInFieldsChange('remember', !this.state.singInFields.remember)
  }

  forgotNumber = () => {
    this.props.navigation.navigate('ForgotNumber')
  }

  forgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword')
  }

  componentWillReceiveProps(nextProps) {
    const { fetchGetUser, setSettings, navigation } = this.props
    const propsCheckerLogin = checkNextProps(nextProps, this.props, 'login')
    if (propsCheckerLogin && propsCheckerLogin != 'empty') {
      const userData = nextProps.login.response.user_data;
      if (nextProps.login.response != 'Invalid Request') {
        if (nextProps.login.response.msg && nextProps.login.response.msg.indexOf('successfully') == -1) {
          this.setState({isLoading: false}, () => {
            Alert.alert(nextProps.login.response.msg)
          })
        } else {
          if (userData && userData.user_id != undefined) {
            fetchGetUser({
              user_id: userData.user_id,
              email: userData.email
            })
          } else {
            this.setState({isLoading: false}, () => {
              Alert.alert('Error loggin. Please try to use email.')
            })
          }
        }
      } else {
        this.setErrorField('password')
        this.setErrorMsg('Invalid Request')
      }
    } else if (propsCheckerLogin == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsCheckerUser = checkNextProps(nextProps, this.props, 'user')
    if (propsCheckerUser && propsCheckerUser != 'empty') {
      const { singInFields } = this.state
      const userData = nextProps.user.response.user_data;
      userData && setSettings({
        rememberLogin: singInFields.remember
      })
      navigation.navigate('Main')
    } else if (propsCheckerUser == 'empty') {
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
  
  render() {
    const { screenProps } = this.props
    const { singInFields, activeFieldName, errorFieldName, errorMsg, isLoading } = this.state
    const { login, password, remember } = singInFields
    const loginNavBarProps = {
      rightPart: {
        image: iconImages.loginCross,
        action: screenProps.handleClose
      }
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView extraScrollHeight={width(16)}>
          <LogInNavBar {...loginNavBarProps} />  
          <View style={styles.topPartWrapper}>
            <Text style={styles.topPartText}>
              Sign In
            </Text>  
          </View>
          <View style={styles.mainContentWrapper}> 
            <StdInput
              placeholder={"E-mail or SunClub number"}
              onChangeText={(text) => this.onSingInFieldsChange('login', text)}
              value={login}
              onBlur={this.onBlur}
              autoCapitalize='none'
              onFocus={() => this.onFocus('login')}
              heighlighted={activeFieldName == 'login'}
              error={errorFieldName == 'login'}
              icon={'emailIcon'} />
            <StdInput
              placeholder={"Password"}
              onChangeText={(text) => this.onSingInFieldsChange('password', text)}
              value={password}
              onBlur={this.onBlur}
              secureTextEntry={true}
              onFocus={() => this.onFocus('password')}
              heighlighted={activeFieldName == 'password'}
              error={errorFieldName == 'password'}
              icon={'passwordIcon'} />
            <View style={styles.rememberCheckWrapper}>
              <StdCheckBox
                onPress={this.handleRememberPress}
                state={remember}
                text="Remember my e-mail/number" /> 
            </View>  
            <View style={styles.singInBtnWrapper}>
              <StdBtn 
                disabled={!Object.keys(singInFields).every(singInFieldKey => requiredList['login'].includes(singInFieldKey) 
                  ? !!singInFields[singInFieldKey]
                  : true
                )} 
                error={errorMsg}
                text="Sign in"
                action={this.singIn}
                heightlighted={true} /> 
            </View>
            <View style={styles.otherBtnsWrapper}>
              <TouchableOpacity style={styles.otherBtn} onPress={this.forgotNumber}>
                <Text style={styles.otherBtnText}>
                  Forgot SunClub Number?
                </Text>  
              </TouchableOpacity>
              <TouchableOpacity style={styles.otherBtn} onPress={this.forgotPassword}>
                <Text style={styles.otherBtnText}>
                  Forgot your Password?
                </Text>  
              </TouchableOpacity>  
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
  rememberCheckWrapper: {
    marginTop: width(12),
  },
  rememberCheckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rememberCheckBoxImageWrapper: {
    width: width(6),
    height: width(6)
  },
  rememberCheckBoxImage: {
    width: '100%',
    height: '100%'
  },
  rememberText: {
    marginLeft: width(3),
    fontSize: width(4.2)
  },
  singInBtnWrapper: {
    height: width(12),
    width: '100%',
    paddingHorizontal: width(1),
    marginTop: width(8)
  },
  otherBtnsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width(8)
  },
  otherBtn: {
    marginVertical: width(1.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherBtnText: {
    fontSize: width(4.2),
    textAlign: 'center'
  }
})