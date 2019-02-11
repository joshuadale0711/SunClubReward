import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Keyboard, Platform, TouchableOpacity, Alert } from 'react-native'
import { Select, Option, OptionList, updatePosition } from 'react-native-dropdown'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NestedScrollView from 'react-native-nested-scroll-view'
import PickerIOS from 'react-native-picker'

import { width, height, iconImages, requiredList } from 'constants/config'

import NavBar from 'components/NavBar'

import StdInput from 'components/StdInput'
import StdCheckBox from 'components/StdCheckBox'
import StdBtn from 'components/StdBtn'

export default class Register1 extends Component {
  constructor(props) {
    super(props);
    const yearData = Array(moment().year()-1899).fill().map((i, idx) => String(1900+idx))
    const registrFields = {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      language: '',
      birthday: yearData[yearData.length - 1],
      gender: ''
    }
    this.state = {
      registrFields,
      activeFieldName: '',
      errorFieldName: '',
      yearData
    }
  }

  componentDidMount() {
    updatePosition(this.refs['SELECT_LANGUAGE']);
    updatePosition(this.refs['OPTIONLIST_LANGUAGE']);
  }

  onRegistrFieldsChange = (fieldName, value) => {
    const newRegistrFields = this.state.registrFields
    switch (fieldName) {
      case 'gender':
        if (newRegistrFields[fieldName] == value) {
          newRegistrFields[fieldName] = ''
        } else {
          newRegistrFields[fieldName] = value
        }
        break  
      default:
      newRegistrFields[fieldName] = value  
    }
    this.setState({registrFields: newRegistrFields})
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

  next = () => {
    const { navigation } = this.props
    const { registrFields } = this.state
    const { password, confirmPassword, birthday } = registrFields
    if (password == confirmPassword) {
      if (password.length < 8 || confirmPassword.length < 8) {
        this.setErrorField('password')
        Alert.alert('Minimal password length is 8')
      } else {
        if (moment().year() - birthday >= 18) {
          registrFields.birthday = '01/01/' + registrFields.birthday
          navigation.navigate('Register2', {registrFields: registrFields})
        } else {
          this.setErrorField('birthday')
          Alert.alert('Oops! You must be 18+ to register')
        }
      }
    } else {
      Alert.alert('Password code do not match confitmation')
      this.setErrorField('confirmPassword')
    }
  }

  getOptionList = (listName) => {
    return this.refs[listName];
  }

  setErrorField = (errorFieldName) => {
    this.setState({ errorFieldName: errorFieldName }, () => {
      setTimeout(() => {
        this.setState({errorFieldName: ''})
      }, 5000)
    })
  }

  openYearPicker = () => {
    const { yearData, registrFields } = this.state
    const { birthday } = registrFields
    PickerIOS.init({
      pickerData: yearData,
      selectedValue: birthday
        ? [birthday]
        : [yearData[yearData.length - 1]],
      onPickerConfirm: data => {
        this.onRegistrFieldsChange('birthday', data[0])
      },
      onPickerCancel: data => {
          // console.log(data);
      },
      onPickerSelect: data => {
          // console.log(data);
      },
      pickerCancelBtnColor: [147, 147, 147, 1],
      pickerTitleText: '',
      pickerFontColor: [255, 255, 255, 1],
      pickerCancelBtnText: 'Cancel',
      pickerConfirmBtnText: 'Confirm'
    });
    PickerIOS.show();
  }
  
  render() {
    const { navigation } = this.props
    const { registrFields, activeFieldName, errorFieldName } = this.state
    const { firstName, middleName, lastName, email, password, language, birthday, gender, confirmPassword } = registrFields
    const navBarProps = {
      leftPart: {
        image: iconImages.loginBack,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Join SunClub Rewards',
        fontSize: width(4.6)
      },
    }
    return (
      <NestedScrollView style={styles.container}>
        <NavBar {...navBarProps} navigation={navigation} /> 
        <View style={styles.mainContentWrapper}>
          <KeyboardAwareScrollView>
            <View style={styles.topPartWrapper}>
              <View style={styles.registrationImageWrapper}>
                <Image style={styles.registrationImage} source={iconImages.registration1} />
              </View>  
            </View>
            <Text style={styles.titleText}>
              Personal information
            </Text>
            <View style={styles.fieldsWrapper}>
              <StdInput
                placeholder={"First name"}
                onChangeText={(text) => this.onRegistrFieldsChange('firstName', text)}
                value={firstName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('firstName')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'firstName'}/>  
              <StdInput
                placeholder={"Middle name"}
                onChangeText={(text) => this.onRegistrFieldsChange('middleName', text)}
                value={middleName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('middleName')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'middleName'}/>  
              <StdInput
                placeholder={"Last name"}
                onChangeText={(text) => this.onRegistrFieldsChange('lastName', text)}
                value={lastName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('lastName')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'lastName'}/>  
              <StdInput
                placeholder={"Email"}
                onChangeText={(text) => this.onRegistrFieldsChange('email', text)}
                value={email}
                autoCapitalize='none'
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('email')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'email'}/>  
              <StdInput
                placeholder={"Password"}
                onChangeText={(text) => this.onRegistrFieldsChange('password', text)}
                value={password}
                onBlur={this.onBlur}
                secureTextEntry={true}
                error={errorFieldName == 'password'}
                onFocus={() => this.onFocus('password')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'password'} />
              <StdInput
                placeholder={"Confirm password"}
                onChangeText={(text) => this.onRegistrFieldsChange('confirmPassword', text)}
                value={confirmPassword}
                onBlur={this.onBlur}
                secureTextEntry={true}
                error={errorFieldName == 'confirmPassword'}
                onFocus={() => this.onFocus('confirmPassword')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'confirmPassword'} />
              <StdInput
                readOnly
                isButton
                onPress={this.openYearPicker}
                placeholderLeft
                placeholder={"Year of birth"}
                value={birthday}
                onBlur={this.onBlur}
                secureTextEntry={true}
                labelStyle={{
                  color: 'black',
                  fontSize: width(4)
                }}
                inputStyle={{
                  height: 'auto',
                  textAlign: 'right',
                  paddingBottom: width(2)
                }}
                error={errorFieldName == 'birthday'}
                onFocus={() => this.onFocus('birthday')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'birthday'} />
              <View style={[styles.row, { marginVertical: width(4), justifyContent: 'flex-start' }]}>
                <StdCheckBox
                  onPress={() => this.onRegistrFieldsChange('gender', 'Male')}
                  state={gender == 'Male'}
                  wrapperCustomStyle={{marginLeft: width(1)}}
                  text="Male" />   
                <StdCheckBox
                  onPress={() => this.onRegistrFieldsChange('gender', 'Female')}
                  state={gender == 'Female'}
                  wrapperCustomStyle={{marginLeft: width(8)}}
                  text="Female" />
                <Text style={styles.optionalText}>
                  (Optional)
                </Text>  
              </View> 
            </View>
            <View style={styles.btnWrapper}>
              <StdBtn 
                disabled={!Object.keys(registrFields).every(registrFieldKey => requiredList['register1'].includes(registrFieldKey) 
                  ? !!registrFields[registrFieldKey]
                  : true
                )}
                text="Next"
                action={this.next}
                heightlighted={true} /> 
            </View>
          </KeyboardAwareScrollView>
        </View>
        <OptionList customScrollViewComp={NestedScrollView} ref="OPTIONLIST_LANGUAGE"/>
      </NestedScrollView>
    );
  }
}

// <DatePicker
//                   style={{width: width(34)}}  
//                   date={birthday}
//                   mode="date"
//                   placeholder="Birthday"
//                   placeholderColor="black"
//                   format="DD/MM/YYYY"
//                   minDate="01/01/1920"
//                   maxDate={moment().format('DD/MM/YYYY')}
//                   confirmBtnText="Confirm"
//                   cancelBtnText="Cancel"
//                   iconComponent={
//                     <View style={styles.datePickerIconWrapper}>
//                       <Image style={styles.datePickerIconImage} source={iconImages.calendarIcon} />
//                     </View>
//                   }
//                   customStyles={{
//                     dateIcon: {

//                     },
//                     dateInput: {
//                       borderWidth: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#F8F8F8',
//                       paddingVertical: width(5),
//                       marginTop: width(0.4)
//                     }
//                   }}
//                   onDateChange={(date) => this.onRegistrFieldsChange('birthday', date)}/>

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContentWrapper: {
    marginHorizontal: width(8)
  },
  topPartWrapper: {
    marginTop: width(8),
    alignItems: 'center',
    justifyContent: 'center'
  },
  registrationImageWrapper: {
    width: width(24),
    height: width(9)
  },
  registrationImage: {
    height: '100%',
    width: '100%'
  },
  fieldsWrapper: {
    marginTop: width(3)
  },
  titleText: {
    color: '#CFCFCF',
    fontSize: width(5.2),
    marginTop: width(8)
  },
  inputWrapper: {
    borderBottomColor: '#F7F7F7',
    marginVertical: width(2)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapperHalf: {
    width: width(40)
  },
  datePickerIconWrapper: {
    height: width(6),
    width: width(6)
  },
  datePickerIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  select: {
    borderWidth: 0,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingVertical: width(2),
    paddingTop: width(3),
    height: '100%'
  },
  optionInSelect: {
    paddingLeft: 0
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  titleSelectText: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#D7D7D7',
    fontSize: width(3.6),
    zIndex: 10
  },
  btnWrapper: {
    height: width(13),
    width: '100%',
    marginVertical: width(8)
  },
  optionalText: {
    color: 'black',
    fontSize: width(3.2),
    marginLeft: width(4)
  }
})
