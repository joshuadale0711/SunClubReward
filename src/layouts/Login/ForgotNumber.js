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
    forgotNumber: state.forgotNumber,
  }),
  dispatch => ({
    fetchForgotNumber: (params) => {
      dispatch(fetchServ(serverUrls.forgotNumber, params, 'FORGOTNUMBER'))
    },
  })
)
export default class ForgotNumber extends Component {
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
    const propsCheckerForgotNumber = checkNextProps(nextProps, this.props, 'forgotNumber')
    if (propsCheckerForgotNumber && propsCheckerForgotNumber != 'empty') {
      if (nextProps.forgotNumber.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.forgotNumber.response.msg)
        })
      } else {
        this.setState({isLoading: false})
      }
    } else if (propsCheckerForgotNumber == 'empty') {
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

  sendNumber = () => {
    const { fetchForgotNumber } = this.props
    const { singInFields } = this.state
    Keyboard.dismiss()
    Object.values(singInFields).every(singInFieldValue => singInFieldValue) && this.setState({isLoading: true}, () => fetchForgotNumber(singInFields))
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
    const { password} = singInFields
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
              Forgot Sunclub number?
            </Text>  
          </View>
          <View style={styles.mainContentWrapper}> 
            <StdInput
              placeholder={"E-mail"}
              onChangeText={(text) => this.onSingInFieldsChange('login', text)}
              value={password}
              onBlur={this.onBlur}
              autoCapitalize='none'
              onFocus={() => this.onFocus('login')}
              heighlighted={activeFieldName == 'login'}
              icon={'emailIcon'} /> 
            <View style={styles.singInBtnWrapper}>
              <StdBtn 
                disabled={!Object.keys(singInFields).every(singInFieldKey => requiredList['forgotNumber'].includes(singInFieldKey) 
                  ? !!singInFields[singInFieldKey]
                  : true
                )}   
                text="Send number"
                action={this.sendNumber}
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