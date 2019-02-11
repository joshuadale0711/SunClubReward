import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Keyboard, Platform, TouchableOpacity, Picker, Alert } from 'react-native'
import { Select, Option, OptionList, updatePosition } from 'react-native-dropdown'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NestedScrollView from 'react-native-nested-scroll-view'
import BusyIndicator from 'react-native-busy-indicator'
import PickerIOS from 'react-native-picker';

import { width, height, iconImages, serverUrls, requiredList } from 'constants/config'
import { checkNextProps } from 'utils/index'
import fetchServ from 'actions/fetchServ'

import NavBar from 'components/NavBar'

import StdInput from 'components/StdInput'
import StdCheckBox from 'components/StdCheckBox'
import StdBtn from 'components/StdBtn'

@connect(
  state => ({
    singup: state.singup,
    cities: state.cities,
    provinces: state.provinces,
    countries: state.countries,
    singup: state.singup
  }),
  dispatch => ({
    fetchSingup: (params) => {
      dispatch(fetchServ(serverUrls.singup, params, 'SINGUP'))
    },
    fetchСountries: (params) => {
      dispatch(fetchServ(serverUrls.countries, params, 'COUNTRIES'))
    },
    fetchCities: (params) => {
      dispatch(fetchServ(serverUrls.cities, params, 'CITIES'))
    },
    fetchProvince: (params) => {
      dispatch(fetchServ(serverUrls.provinces, params, 'PROVINCES'))
    },
  })
)
export default class Register1 extends Component {
  constructor(props) {
    super(props);
    const registrFields = {
      appartmentNumber: '',
      streetNumber: '',
      streetName: '',
      country: '',
      province: '',
      zipCode: '',
      city: '',
      promotionCode: '',
      agreeWithTerms: false
    }
    this.state = {
      registrFields,
      activeFieldName: '',
      isLoading: false,
      availableCountries: [],
      availableProvinces: [],
      availableCities: [],
      errorFieldName: '',
      errorMsg: ''
    }
  }

  componentWillMount() {
    const { fetchСountries } = this.props
    this.setState({isLoading: true}, () => fetchСountries())
  }

  componentWillReceiveProps(nextProps) {
    const { navigation } = nextProps
    const propsCheckerSingup = checkNextProps(nextProps, this.props, 'singup')
    if (propsCheckerSingup && propsCheckerSingup != 'empty') {
      // const streams = nextProps.listStream.response.streams;
      // const data = this.state.listStream.concat(streams);
      // this.setState({
      //   listStream: data,
      //   isLoading: false,
      // });
      if (nextProps.singup.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.singup.response.msg)
          navigation.navigate('Login')
        })
      } else {
        this.setState({isLoading: false})
      }
    } else if (propsCheckerSingup == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsCheckerCountries = checkNextProps(nextProps, this.props, 'countries')
    if (propsCheckerCountries && propsCheckerCountries != 'empty') {
      if (nextProps.countries.response.msg) {
        Alert.alert(nextProps.countries.response.msg)
        this.setState({isLoading: false})
      } else {
        let countries = nextProps.countries.response;
        const getIndexOfCanada = countries.findIndex(country => country.name == 'Canada')
        const findCanada = countries.find(country => country.name == 'Canada')
        if (getIndexOfCanada != -1) {
          countries.splice(getIndexOfCanada, 1)
          countries.splice(0, 0, findCanada)
        }
        this.setState({
          availableCountries: countries || [],
          isLoading: false,
        });
        this.onRegistrFieldsChange('province', '')
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
          availableProvinces: provinces || [],
          isLoading: false,
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
          availableCities: cities || [],
          isLoading: false,
        });
      }
    } else if (propsCheckerCities == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }

  getOptionList = (listName) => {
    return this.refs[listName];
  }

  onRegistrFieldsChange = (fieldName, value) => {
    const { availableCountries, availableProvinces, errorFieldName } = this.state
    const { fetchCities, fetchProvince } = this.props
    const newRegistrFields = this.state.registrFields
    const prevValue = newRegistrFields[fieldName]
    switch (fieldName) {
      case 'agreeWithTerms':
        newRegistrFields[fieldName] = !newRegistrFields[fieldName]
        break
      case 'country':
        if (availableCountries && availableCountries.length) { 
          newRegistrFields[fieldName] = availableCountries.find(countryObj => countryObj.name == value) && availableCountries.find(countryObj => countryObj.name == value).id || ''
          if (prevValue != newRegistrFields[fieldName]) {
            this.onRegistrFieldsChange('province', '')
            this.onRegistrFieldsChange('city', '')
            this.setState({ availableProvinces: [], availableCities: [] })
          }
        }
        break
      case 'province':
        newRegistrFields[fieldName] = value
        if (prevValue != newRegistrFields[fieldName]) {
          this.onRegistrFieldsChange('city', '')
          this.setState({availableCities: []})
        }
        break  
      default:
        newRegistrFields[fieldName] = value  
    }
    switch (fieldName) {
      case 'country':
        if (newRegistrFields[fieldName] !== '' && (newRegistrFields[fieldName] == 0 || newRegistrFields[fieldName])) this.setState({isLoading: true}, () => fetchProvince({country: newRegistrFields['country']}))
        break 
      case 'province':
        if (newRegistrFields[fieldName] !== '') {
          const provinceId = availableProvinces && availableProvinces.length && availableProvinces.find(provinceObj => provinceObj.name == value) && availableProvinces.find(provinceObj => provinceObj.name == value).id || ''
          if (provinceId == 0 || provinceId) this.setState({isLoading: true}, () => fetchCities({country: newRegistrFields['country'], province: provinceId}))
        }
        break 
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

  singup = () => {
    const { navigation, fetchSingup } = this.props
    const { registrFields } = this.state
    const { state } = navigation
    Keyboard.dismiss()
    this.setState({ isLoading: true }, () => {
      fetchSingup({...state.params.registrFields, ...registrFields})
    })
  }

  setErrorField = (errorFieldName) => {
    this.setState({ errorFieldName: errorFieldName }, () => {
      setTimeout(() => {
        this.setState({errorFieldName: ''})
      }, 5000)
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
        //     this.onRegistrFieldsChange(fieldName, pickerData[0])
        //   }
        // }
        this.onRegistrFieldsChange(fieldName, pickerData[0])
      },
    });
    PickerIOS.show();
  }
  
  render() {
    const { navigation } = this.props
    const { registrFields, activeFieldName, availableCountries, availableProvinces, availableCities, isLoading } = this.state
    const { appartmentNumber, streetNumber, streetName, country, province, zipCode, city, promotionCode, agreeWithTerms } = registrFields
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
                <Image style={styles.registrationImage} source={iconImages.registration2} />
              </View>  
            </View>
            <Text style={styles.titleText}>
              Mailing address to send card
            </Text>
            <View style={styles.fieldsWrapper}>
              <View style={styles.row}>
                <StdInput
                  placeholder={"Apartment"}
                  onChangeText={(text) => this.onRegistrFieldsChange('appartmentNumber', text)}
                  value={appartmentNumber}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('appartmentNumber')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'appartmentNumber'} />
                <StdInput
                  placeholder={"Street number"}
                  onChangeText={(text) => this.onRegistrFieldsChange('streetNumber', text)}
                  value={streetNumber}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('streetNumber')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'streetNumber'} />
              </View>
              <StdInput
                placeholder={"Street name"}
                onChangeText={(text) => this.onRegistrFieldsChange('streetName', text)}
                value={streetName}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('streetName')}
                wrapperCustomStyle={[styles.inputWrapper]}
                heighlighted={activeFieldName == 'streetName'} />
                <View style={[styles.row, {marginVertical: width(2)}]}>
                <View style={[Platform.OS != 'ios' && styles.selectWrapper]}>
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
                          onPress={() => this.showPicker('country', availableCountries && availableCountries.find(countryObj => countryObj.id == country) && availableCountries.find(countryObj => countryObj.id == country).name, availableCountries && [...availableCountries], availableCountries)}
                          onChangeText={(text) => this.onRegistrFieldsChange('country', text)}
                          value={availableCountries && availableCountries.find(countryObj => countryObj.id == country) && availableCountries.find(countryObj => countryObj.id == country).name}
                          onBlur={this.onBlur}
                          onFocus={() => this.onFocus('country')}
                          wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                          heighlighted={activeFieldName == 'country'} />
                      : <Picker
                          style={[styles.select, {width: width(45)}]}  
                          selectedValue={availableCountries && availableCountries.find(countryObj => countryObj.id == country) && availableCountries.find(countryObj => countryObj.id == country).name}
                          onValueChange={(text) => this.onRegistrFieldsChange('country', text)}>
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
                          onChangeText={(text) => this.onRegistrFieldsChange('province', text)}
                          value={province}
                          onBlur={this.onBlur}
                          onFocus={() => this.onFocus('province')}
                          wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                          heighlighted={activeFieldName == 'province'} />
                      : <Picker
                          style={[styles.select, {width: width(45)}]}  
                          selectedValue={province}
                          onValueChange={(text) => this.onRegistrFieldsChange('province', text)}>
                          {
                            availableProvinces && ['', ...availableProvinces].map(provinceObj => <Picker.Item label={provinceObj && provinceObj.name || ''} value={provinceObj && provinceObj.name||''} key={provinceObj && provinceObj.id||'0'} />)
                          }
                        </Picker>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <StdInput
                  placeholder={"Postal code"}
                  onChangeText={(text) => this.onRegistrFieldsChange('zipCode', text)}
                  value={zipCode}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('zipCode')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'zipCode'} />
                <StdInput
                  placeholder={"City"}
                  onChangeText={(text) => this.onRegistrFieldsChange('city', text)}
                  value={city}
                  onBlur={this.onBlur}
                  onFocus={() => this.onFocus('city')}
                  wrapperCustomStyle={[styles.inputWrapper, styles.inputWrapperHalf]}
                  heighlighted={activeFieldName == 'city'}/>
              </View>
              <StdInput
                placeholder={"Promotion code"}
                onChangeText={(text) => this.onRegistrFieldsChange('promotionCode', text)}
                value={promotionCode}
                onBlur={this.onBlur}
                onFocus={() => this.onFocus('promotionCode')}
                wrapperCustomStyle={styles.inputWrapper}
                heighlighted={activeFieldName == 'promotionCode'}/>
            </View>
            <View style={styles.agreeCheckboxWrapper}>
              <StdCheckBox
                onPress={() => this.onRegistrFieldsChange('agreeWithTerms')}
                state={agreeWithTerms}
                text="Agree with terms and conditions" /> 
            </View>
            <Text style={styles.warn} >
              By signing up today, collect 100 BONUS POINTS!
            </Text>
            <View style={styles.btnWrapper}>
              <StdBtn
                disabled={!Object.keys(registrFields).every(registrFieldKey => requiredList['register2'].includes(registrFieldKey) 
                  ? !!registrFields[registrFieldKey]
                  : true
                )} 
                text="Sign Up"
                action={this.singup}
                heightlighted={true} /> 
            </View>
          </KeyboardAwareScrollView>
        </View>
        <BusyIndicator isVisible={isLoading} size="large"/>
      </NestedScrollView>
    );
  }
}

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
    marginLeft: width(-2)
  },
  optionInSelect: {
    paddingLeft: 0
  },
  selectWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: width(2)
  },
  titleSelectText: {
    color: '#D7D7D7',
    fontSize: width(3.6),
  },
  btnWrapper: {
    height: width(13),
    width: '100%',
    marginVertical: width(8)
  },
  agreeCheckboxWrapper: {
    marginTop: width(6)
  },
  warn: {
    marginTop: width(8),
    color: '#F9AE4D',
    fontSize: width(3.6),
    textAlign: 'center'
  },
  titleSelectText: {
    color: '#D7D7D7',
    fontSize: width(3.6),
    textAlign: 'left'
  }
})

// <Select
//   width={width(36)}
//   ref="SELECT_COUNTRY"
//   optionListProps={{
//     autoHeightItemsList: true,
//     topOffset: 10,
//     leftOffset: -2,
//     extraWidth: 16
//   }}
//   optionListRef={() => this.getOptionList('OPTIONLIST_COUNTRY')}
//   defaultValue="Country"
//   style={styles.select}
//   styleOption={styles.optionInSelect}
//   onSelect={(text) => this.onRegistrFieldsChange('country', text)}>
//   {
//     availableCountries && availableCountries.map(countryObj => <Option key={countryObj.id}>{countryObj.name}</Option>)
//   }
// </Select>


// <View style={styles.selectWrapper}>
//   <Text style={styles.titleSelectText}>
//     City
//   </Text>
//   <Picker
//     style={[styles.select, {width: width(45), marginLeft: 0}]}  
//     selectedValue={city}
//     onValueChange={(text) => this.onRegistrFieldsChange('city', text)}>
//     {
//       availableCities && ['', ...availableCities].map(cityObj => <Picker.Item label={cityObj && cityObj.name || ''} value={cityObj && cityObj.name || ''} key={cityObj && cityObj.id || '0'} />)
//     }
//   </Picker>
// </View>