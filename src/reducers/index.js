import { persistCombineReducers } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import routes from './routes'
import loginRoutes from './loginRoutes'
import errors from './errors'
import settings from './settings'

// requests imports
import request from './request'
import login from './login'
import provinces from './provinces'
import addProduct from './addProduct'
import changePassword from './changePassword'
import changePinCode from './changePinCode'
import checkPromoCode from './checkPromoCode'
import cities from './cities'
import countries from './countries'
import editProfile from './editProfile'
import forgetPinCode from './forgetPinCode'
import forgotNumber from './forgotNumber'
import forgotPassword from './forgotPassword'
import cardImage from './cardImage'
import user from './user'
import listOffers from './listOffers'
import listStatements from './listStatements'
import singup from './singup'

const persistConfig = {
  key: 'primary',
  storage: AsyncStorage,
  debug: true,
  blacklist: [],
  whitelist: ['settings', 'user', 'countries']
}

export default persistCombineReducers(persistConfig, {
  routes,
  loginRoutes,
  errors,
  settings,
  request,
  login,
  provinces,
  addProduct,
  changePassword,
  changePinCode,
  checkPromoCode,
  cities,
  countries,
  editProfile,
  forgetPinCode,
  forgotNumber,
  forgotPassword,
  cardImage,
  user,
  listOffers,
  listStatements,
  singup
})