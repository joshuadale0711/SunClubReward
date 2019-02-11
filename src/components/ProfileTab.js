import React, { Component, PureComponent } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Text, Platform, Picker, Alert } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { Select, Option, OptionList, updatePosition } from 'react-native-dropdown'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NestedScrollView from 'react-native-nested-scroll-view'
import BusyIndicator from 'react-native-busy-indicator'
import PickerIOS from 'react-native-picker';

import { height, width, iconImages, serverUrls, requiredList } from 'constants/config'
import { checkNextProps, filterBlackList } from 'utils/index'
import fetchServ from 'actions/fetchServ'

import StdInput from 'components/StdInput'
import StdCheckBox from 'components/StdCheckBox'
import StdBtn from 'components/StdBtn'

var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

@connect(
  state => ({
    user: state.user,
    provinces: state.provinces,
    cities: state.cities,
    countries: state.countries,
    editProfile: state.editProfile
  }),
  dispatch => ({
    fetchСountries: (params) => {
      dispatch(fetchServ(serverUrls.countries, params, 'COUNTRIES'))
    },
    fetchCities: (params) => {
      dispatch(fetchServ(serverUrls.cities, params, 'CITIES'))
    },
    fetchProvince: (params) => {
      dispatch(fetchServ(serverUrls.provinces, params, 'PROVINCES'))
    },
    fetchEditProfile: (params) => {
      dispatch(fetchServ(serverUrls.editProfile, params, 'EDITPROFILE'))
    },
    fetchGetUser: (params) => {
      dispatch(fetchServ(serverUrls.getUser, params, 'USER'))
    },
  })
)
export default class AccountTab extends Component {
  constructor(props) {
    super(props);
    const userData = props.user && props.user.response && props.user.response.user_data
    const yearData = Array(moment().year()-1899).fill().map((i, idx) => String(1900+idx))
    const infoFields = {
      avatar: userData && userData.UserProfilePic || '',
      membership: userData && userData.card_number || '',
      firstName: userData && userData.fname || '',
      middleName: userData && userData.Mname || '',
      lastName: userData && userData.lname || '',
      email: userData && userData.email || '',
      gender: userData && userData.gender || '',
      birthday: userData && moment(userData.dob, 'YYYY-MM-DD').format('YYYY') || '',
      membershipNumber: userData && userData.card_number,
      appartmentNumber: userData && userData.apt,
      streetNumber: userData && userData.stnum,
      streetName: userData && userData.stname,
      country: userData && userData.country || '',
      province: userData && userData.province || '',
      city: userData && userData.city || '',
      zipCode: userData && userData.zip || '',
      avatarSource: ''
    }
    this.state = {
      infoFields,
      activeFieldName: '',
      availableCountries: [],
      availableProvinces: [],
      availableCities: [],
      errorMsg: '',
      editedFields: [],
      yearData
    }
  }

  componentWillMount() {
    const { countries, provinces, cities, user, fetchCities, fetchProvince, fetchСountries } = this.props
    const userData = user && user.response && user.response.user_data
    if (!(countries && countries.response)) {
      this.setState({isLoading: true}, () => fetchСountries())
    } else {
      this.setState({
        availableCountries: countries.response
      })
    }
    if (userData && (userData.country != 0 || userData.country)) this.setState({isLoading: true}, () => fetchProvince({country: userData.country}))
    // if (userData && (userData.country != 0 || userData.country) && provinces && provinces.response && provinces.response.provinces) { 
    //   const foundProvince = provinces.response.provinces.find(provinceObj => provinceObj.name == userData.province)
    //   foundProvince && fetchCities({ country: userData.country, province: foundProvince.id })
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { fetchCities, fetchGetUser, fetchProvince, setSettings } = this.props
    const { user, cities, provinces } = nextProps
    const { infoFields } = this.state
    const userData = user && user.response && user.response.user_data
    const propsCheckerCountries = checkNextProps(nextProps, this.props, 'countries')
    if (propsCheckerCountries && propsCheckerCountries != 'empty') {
      let countries = nextProps.countries.response
      const getIndexOfCanada = countries.findIndex(country => country.name == 'Canada')
      const findCanada = countries.find(country => country.name == 'Canada')
      if (getIndexOfCanada != -1) {
        countries.splice(getIndexOfCanada, 1)
        countries.splice(0, 0, findCanada)
      }
      if (nextProps.countries.response.msg) {
        Alert.alert(nextProps.countries.response.msg)
        this.setState({isLoading: false})
      } else {
        if (infoFields && !isNaN(infoFields.country)) {
          const foundCountryObj = countries && countries.find(countryObj => String(countryObj.id) == String(infoFields.country))
          this.onInfoFieldsChange('country', foundCountryObj ? foundCountryObj.name : '')
        }
        this.setState({
          availableCountries: countries,
          isLoading: false,
        }, () => {
          if (userData && (userData.country != 0 || userData.country)) {
            if (userData.country != '') {
              this.setState({isLoading: true}, () => fetchProvince({ country: userData.country }))
            } else {
              this.onInfoFieldsChange('province', '')
              this.onInfoFieldsChange('city', '')
            }
          } 
        });
      }
    } else if (propsCheckerCountries == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsCheckerProvinces = checkNextProps(nextProps, this.props, 'provinces')
    if (propsCheckerProvinces && propsCheckerProvinces != 'empty') {
      if (nextProps.provinces.response.msg) {
        Alert.alert(nextProps.provinces.response.msg)
        this.setState({isLoading: false})
      } else {
        const provinces = nextProps.provinces.response.provinces;
        this.setState({
          availableProvinces: provinces,
          isLoading: false,
        }, () => {
          if (userData && (userData.country != 0 || userData.country) && provinces) { 
            const findProvince = provinces.find(provinceObj => provinceObj.name == userData.province)
            if (findProvince) {
              this.setState({isLoading: true}, () => fetchCities({country: userData.country, province: findProvince.id} || ''))
            } else {
              this.onInfoFieldsChange('city', '')
            }
          }
        });
      }
    } else if (propsCheckerProvinces == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsCheckerCities = checkNextProps(nextProps, this.props, 'cities')
    if (propsCheckerCities && propsCheckerCities != 'empty') {
      if (nextProps.cities.response.msg) {
        // Alert.alert(nextProps.cities.response.msg)
        this.setState({isLoading: false})
      } else {
        const cities = nextProps.cities.response.cities;
        this.setState({
          availableCities: cities,
          isLoading: false,
        });
      }
    } else if (propsCheckerCities == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsCheckerEditProfile = checkNextProps(nextProps, this.props, 'editProfile')
    if (propsCheckerEditProfile && propsCheckerEditProfile != 'empty') {
      if (nextProps.editProfile.response.msg != 'Incorrect input parameters' && nextProps.editProfile.response.msg != 'Unconfirmed user. please contact administrator') {
        const userData = nextProps.user.response.user_data;
        const { email } = this.state.infoFields
        userData && fetchGetUser({
          user_id: userData.user_id,
          email: email
        })
      } else {
        this.setErrorMsg(nextProps.editProfile.response.msg)
      }
      if (nextProps.editProfile.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.editProfile.response.msg)
        })
      }
    } else if (propsCheckerEditProfile == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsCheckerUser = checkNextProps(nextProps, this.props, 'user')
    if (propsCheckerUser && propsCheckerUser != 'empty') {
      const { singInFields } = this.state
      const userData = nextProps.user.response.user_data;
    } else if (propsCheckerUser == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }

  onInfoFieldsChange = (fieldName, value) => {
    const { fetchProvince, fetchCities } = this.props
    const { availableCountries, availableProvinces } = this.state
    const newInfoFields = this.state.infoFields
    const prevValue = newInfoFields[fieldName]
    switch (fieldName) {
      case 'country':
        if (availableCountries && availableCountries.length) {
          newInfoFields[fieldName] = availableCountries.find(countryObj => countryObj.name == value) && availableCountries.find(countryObj => countryObj.name == value).id
          if (prevValue != newInfoFields[fieldName]) {
            this.onInfoFieldsChange('province', '')
            this.onInfoFieldsChange('city', '')
            this.setState({availableProvinces: [], availableCities: []})
          }
        }
        break 
      case 'province':
        newInfoFields[fieldName] = value
        if (prevValue != newInfoFields[fieldName]) {
          this.onInfoFieldsChange('city', '')
          this.setState({availableCities: []})
        }
        break  
      case 'gender':
        if (newInfoFields[fieldName] == value) {
          newInfoFields[fieldName] = ''
        } else {
          newInfoFields[fieldName] = value
        }
        break  
      default:
        newInfoFields[fieldName] = value  
    }
    switch (fieldName) {
      case 'country':
        if (newInfoFields[fieldName] !== '' && (newInfoFields[fieldName] == 0 || newInfoFields[fieldName])) this.setState({isLoading: true}, () => fetchProvince({country: newInfoFields['country']}))
        break 
      case 'province':
        if (newInfoFields[fieldName] !== '') {
          const provinceId = availableProvinces && availableProvinces.length && availableProvinces.find(provinceObj => provinceObj.name == value) && availableProvinces.find(provinceObj => provinceObj.name == value).id
          if (provinceId == 0 || provinceId) this.setState({isLoading: true}, () => fetchCities({country: newInfoFields['country'], province: provinceId}))
        }
        break 
    }
    this.setState({infoFields: newInfoFields, editedFields:[...this.state.editedFields, fieldName]})
  }

  onBlur = () => {
    this.setState({ activeFieldName: ''})
  }

  onFocus = (fieldName) => {
    this.setState({ activeFieldName: fieldName})
  }

  getOptionList = (listName) => {
    return this.refs[listName];
  }

  update = () => {
    const { user, fetchEditProfile } = this.props
    const { infoFields, editedFields } = this.state
    const userData = user && user.response && user.response.user_data
    userData && this.setState({isLoading: true}, () => {
      console.log('make a request')
      fetchEditProfile({
        ...infoFields,
        birthday: '01/01/' + infoFields.birthday,
        user_id: userData.user_id,
        email: userData.email
      })
    })
  }

  onAvatarPress = () => {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (response.didCancel) {
        Alert.alert('Image cancel')
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        Alert.alert('Image error ' + response.error)
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // let source = { uri: response.uri };

        let source = response.data
        const uri = '' + response.uri
  
        this.onInfoFieldsChange('avatar', uri)
        this.onInfoFieldsChange('avatarSource', source)
      }
    });
  }

  setErrorMsg = (msg) => {
    this.setState({ errorMsg: msg }, () => {
      setTimeout(() => {
        this.setState({errorMsg: ''})
      }, 3000)
    })
  }
  
  showPicker = (fieldName, value, data) => {
    PickerIOS.init({
      pickerData: data.map(dataItem => dataItem.name),
      selectedValue: value ? [value] : [],
      pickerTitleText: 'Select ' + fieldName,
      onPickerConfirm: pickerData => {
        // let value;
        // if (fieldName == 'country') {
        //   const foundCountryByName = data.find(dataItem => dataItem.name == pickerData[0])
        //   if (foundCountryByName) {
        //     this.onInfoFieldsChange(fieldName, pickerData[0])
        //   }
        // }
        this.onInfoFieldsChange(fieldName, pickerData[0])
      },
    });
    PickerIOS.show();
  }

  openYearPicker = () => {
    const { yearData, infoFields } = this.state
    const { birthday } = infoFields
    PickerIOS.init({
      pickerData: yearData,
      selectedValue: birthday
        ? [birthday]
        : [yearData[yearData.length - 1]],
      onPickerConfirm: data => {
        this.onInfoFieldsChange('birthday', data[0])
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
    const { navigation, user } = this.props
    const { infoFields, activeFieldName, availableCountries, availableProvinces, availableCities, errorMsg, isLoading } = this.state
    const { avatar, membership, firstName, middleName, lastName, email, gender, birthday, membershipNumber, 
      appartmentNumber, streetNumber, streetName, country, province, city, zipCode } = infoFields
    const userData = user && user.response && user.response.user_data
    return (
      <View style={{flex:1}}>
      <NestedScrollView style={styles.container}>

          <View style={styles.avatarPart}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarInner}>
                {
                  avatar 
                    ? <Image
                        style={styles.avatarImage}
                        source={{uri: avatar}} />
                    : null
                }
              </View>
              <TouchableOpacity onPress={this.onAvatarPress} style={styles.editAvatarWrapper}>
                <Image style={styles.editAvatarImage} source={iconImages.editAvatarIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoPartWrapper}>
            <Text style={styles.titleText}>
              Member Info
            </Text>
            <View style={styles.memberInfo}>
              <StdInput
                placeholderUp={true}
                placeholder={"Membership"}
                onChangeText={(text) => this.onInfoFieldsChange('membership', text)}
                value={membership}
                readOnly={true}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('membership')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'membership'}/>
              <StdInput
                placeholderUp={true}
                placeholder={"First name"}
                onChangeText={(text) => this.onInfoFieldsChange('firstName', text)}
                value={firstName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('firstName')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'firstName'}/>
              <StdInput
                placeholderUp={true}
                placeholder={"Middle name"}
                onChangeText={(text) => this.onInfoFieldsChange('middleName', text)}
                value={middleName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('middleName')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'middleName'}/>
              <StdInput
                placeholderUp={true}
                placeholder={"Last name"}
                onChangeText={(text) => this.onInfoFieldsChange('lastName', text)}
                value={lastName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('lastName')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'lastName'}/>
              <StdInput
                placeholderUp={true}
                placeholder={"Email"}
                onChangeText={(text) => this.onInfoFieldsChange('email', text)}
                value={email}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('email')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'email'} />
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
                onFocus={() => this.onFocus('birthday')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'birthday'} />
              <View style={[styles.row, {marginVertical: width(4), justifyContent: 'flex-start'}]}>
                <StdCheckBox
                  onPress={() => this.onInfoFieldsChange('gender', 'Male')}
                  state={gender == 'Male'}
                  wrapperCustomStyle={{marginLeft: width(1)}}
                  text="Male" />   
                <StdCheckBox
                  onPress={() => this.onInfoFieldsChange('gender', 'Female')}
                  state={gender == 'Female'}
                  wrapperCustomStyle={{marginLeft: width(8)}}
                  text="Female" />
                <Text style={styles.optionalText}>
                  (Optional)
                </Text>  
              </View>  
            </View>
            <View style={styles.addressInfo}>
              <StdInput
                placeholderUp={true}
                placeholder={"Membership No."}
                readOnly={true}
                onChangeText={(text) => this.onInfoFieldsChange('membershipNumber', text)}
                value={membershipNumber}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('membershipNumber')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'membershipNumber'} />
              <View style={styles.row}>
                <StdInput
                  placeholderUp={true}
                  placeholder={"Apartment"}
                  onChangeText={(text) => this.onInfoFieldsChange('appartmentNumber', text)}
                  value={appartmentNumber}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('appartmentNumber')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'appartmentNumber'} />
                <StdInput
                  placeholderUp={true}
                  placeholder={"Street number"}
                  onChangeText={(text) => this.onInfoFieldsChange('streetNumber', text)}
                  value={streetNumber}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('streetNumber')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'streetNumber'} />
              </View>
              <StdInput
                placeholderUp={true}
                placeholder={"Street name"}
                onChangeText={(text) => this.onInfoFieldsChange('streetName', text)}
                value={streetName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('streetName')}
                wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                heighlighted={activeFieldName == 'streetName'} />
              <View style={[styles.row, {marginVertical: width(2)}]}>
                <View style={styles.selectWrapper}>
                  {
                    Platform.OS == 'ios'
                      ? null
                      : <Text style={styles.titleSelectText}>
                          Country
                        </Text>
                  }  
                  {
                    Platform.OS == 'ios'
                      ? <StdInput
                          placeholderUp={true}
                          placeholder={"Country"}
                          isButton={true}
                          readOnly={true}
                          onPress={() => this.showPicker('country', availableCountries && availableCountries.find(countryObj => countryObj.id == country) && availableCountries.find(countryObj => countryObj.id == country).name, availableCountries && ['', ...availableCountries], availableCountries)}
                          onChangeText={(text) => this.onInfoFieldsChange('country', text)}
                          value={availableCountries && availableCountries.find(countryObj => countryObj.id == country) && availableCountries.find(countryObj => countryObj.id == country).name}
                          onBlur={this.onBlur}
                          onFocus={() => this.onFocus('country')}
                          wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                          heighlighted={activeFieldName == 'country'} />
                      : <Picker
                          style={[styles.select, {width: width(45)}]}  
                          selectedValue={availableCountries && availableCountries.find(countryObj => countryObj.id == country) && availableCountries.find(countryObj => countryObj.id == country).name}
                          onValueChange={(text) => this.onInfoFieldsChange('country', text)}>
                          {
                            availableCountries && ['', ...availableCountries].map(countryObj => <Picker.Item label={countryObj && countryObj.name || ''} value={countryObj && countryObj.name || ''} key={countryObj && countryObj.id||'0'} />)
                          }
                        </Picker>
                  }
                </View>
                <View style={styles.selectWrapper}>
                  {
                    Platform.OS == 'ios'
                      ? null
                      : <Text style={styles.titleSelectText}>
                      Province
                        </Text>
                  } 
                  {
                    Platform.OS == 'ios'
                      ? <StdInput
                          placeholderUp={true}
                          placeholder={"Province"}
                          isButton={true}
                          readOnly={true}
                          onPress={() => this.showPicker('province', province, availableProvinces)}
                          onChangeText={(text) => this.onInfoFieldsChange('province', text)}
                          value={province}
                          onBlur={this.onBlur}
                          onFocus={() => this.onFocus('province')}
                          wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                          heighlighted={activeFieldName == 'province'} />
                      : <Picker
                          style={[styles.select, {width: width(45)}]}  
                          selectedValue={province}
                          onValueChange={(text) => this.onInfoFieldsChange('province', text)}>
                          {
                            availableProvinces && ['', ...availableProvinces].map(provinceObj => <Picker.Item label={provinceObj && provinceObj.name || ''} value={provinceObj && provinceObj.name||''} key={provinceObj && provinceObj.id||'0'} />)
                          }
                        </Picker>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <StdInput
                  placeholder={"City"}
                  onChangeText={(text) => this.onInfoFieldsChange('city', text)}
                  value={city}
                  placeholderUp={true}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('city')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'city'}/>
                <StdInput
                  placeholderUp={true}
                  placeholder={"Postal/Zipcode"}
                  onChangeText={(text) => this.onInfoFieldsChange('zipCode', text)}
                  value={zipCode}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('zipCode')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'zipCode'} />
              </View>
            </View>  
          </View>
          <View style={styles.updateBtnWrapper}>
            <StdBtn 
              disabled={!Object.keys(infoFields).every(infoFieldKey => requiredList['info'].includes(infoFieldKey) 
                ? !!infoFields[infoFieldKey]
                : true
              )} 
              error={errorMsg}
              text="Update"
              action={this.update}
              heightlighted={true} /> 
          </View>
        </NestedScrollView> 
        <BusyIndicator isVisible={isLoading} size="large"/>
      </View>
    );
  }
}

// <StdInput
//   placeholderUp={true}
//   placeholder={"City"}
//   onChangeText={(text) => this.onInfoFieldsChange('city', text)}
//   value={city}
//   onBlur={this.onBlur}
//   onFocus={() => this.onFocus('city')}
//   wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
//   heighlighted={activeFieldName == 'city'} />


// <DatePicker
//                   style={{width: width(34)}}
//                   date={birthday}
//                   mode="date"
//                   placeholder="select date"
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
//                       marginTop: width(0.8)
//                     }
//                   }}
//                   onDateChange={(date) => this.onInfoFieldsChange('birthday', date)}/>

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarPart: {
    marginTop: width(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarWrapper: {
    width: width(40),
    height: width(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarInner: {
    width: width(40),
    height: width(40),
    borderRadius: width(40),
    overflow: 'hidden',
    borderColor: '#FAB864',
    borderWidth: 3,
    borderStyle: 'solid',
    overflow: 'hidden'
  },
  avatarImage: {
    height: '100%',
    width: '100%'
  },
  editAvatarWrapper: {
    height: width(12),
    width: width(12),
    position: 'absolute',
    bottom: width(0.5),
    right: width(0.5),
    borderRadius: width(12),
  },
  editAvatarImage: {
    height: '100%',
    width: '100%'
  },
  infoPartWrapper: {
    marginTop: width(10),
    marginHorizontal: width(8)
  },
  titleText: {
    color: '#CFCFCF',
    fontSize: width(5.8)
  },
  infoPartInner: {

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
  updateBtnWrapper: {
    height: width(12),
    marginBottom: width(10),
    marginHorizontal: width(8)
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
    marginLeft: width(-2)
  },
  optionInSelect: {
    paddingLeft: 0
  },
  selectWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  titleSelectText: {
    color: '#D7D7D7',
    fontSize: width(3.6),
  },
  optionalText: {
    color: 'black',
    fontSize: width(3.2),
    marginLeft: width(4)
  }
})
