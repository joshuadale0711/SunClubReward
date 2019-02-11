import { Dimensions, Platform } from 'react-native'
import moment from 'moment'

const window = Dimensions.get('window');
export const width = (pers) => {
    return pers / 100 * window.width
}
export const height = (pers) => {
    return pers / 100 * window.height
}

export const widthForOr = (initialOrientationKey, orientationkey) => initialOrientationKey == 'PORTRAIT'
    ? orientationkey == 'PORTRAIT' ? width : height
    : orientationkey == 'LANDSCAPE' ? height : width


export const heightForOr = (initialOrientationKey, orientationkey) => initialOrientationKey == 'PORTRAIT'
  ? orientationkey == 'PORTRAIT' ? height : width
  : orientationkey == 'LANDSCAPE' ? width : height

export const demWidth = Dimensions.get('window').width
export const demHeight = Dimensions.get('window').height


export const isIphoneX = () => Platform.OS === 'ios' && (window.height === 812 || window.width === 812)

export const iconImages = {
	loginBack: require('images/loginBack.png'),
	loginCross: require('images/loginCross.png'),
	emailIcon: require('images/emailIcon.png'),
	passwordIcon: require('images/passwordIcon.png'),
	checkBoxIcon: require('images/checkBoxIcon.png'),
	checkBoxActiveIcon: require('images/checkBoxActiveIcon.png'),
	homeIcon: require('images/homeIcon.png'),
	accountIncon: require('images/accountIncon.png'),
	cardIcon: require('images/cardIcon.png'),
	profileIcon: require('images/profileIcon.png'),
	faqIcon: require('images/faqIcon.png'),
	aboutIcon: require('images/aboutIcon.png'),
	logoutIcon: require('images/logoutIcon.png'),
	menuIcon: require('images/menuIcon.png'),
	mailNavBarIcon: require('images/mailNavBarIcon.png'),
	editAvatarIcon: require('images/editAvatarIcon.png'),
	calendarIcon: require('images/calendarIcon.png'),
	arrowDownIcon: require('images/arrowDownIcon.png'),
	registration1: require('images/registration1.png'),
	registration2: require('images/registration2.png'),
}

export const menuItems = [
	{
		icon: null,
		image: iconImages.homeIcon,
		text: 'Home',
		action: 'Main'
	},
	{
		icon: null,
		image: iconImages.accountIncon,
		text: 'Statements',
		action: 'Statements'
	},
	{
		icon: null,
		image: iconImages.cardIcon,
		text: 'My card',
		action: 'Card'
	},
	{
		icon: null,
		image: iconImages.profileIcon,
		text: 'My profile',
		action: 'Profile'
	},
	{
		icon: null,
		image: iconImages.faqIcon,
		text: 'FAQ',
		action: 'FAQ'
	},
	{
		icon: null,
		image: iconImages.logoutIcon,
		text: 'Log out',
		action: 'logout'
	},
]

export const accountTopBarButtons = [
	{
		text: 'Profile',
		action: 'profile'
	},
	{
		text: 'Change password',
		action: 'changePassword'
	},
	{
		text: 'Pin code',
		action: 'pinCode'
	},
	{
		text: 'Invite',
		action: 'invite'
	},
]

export const swiperContent = [
	{
		title: 'The Beginning of an Incredable Journey',
		desc: 'The thrill of travelling starts with the excitement on decideng where to go next'
	},
	{
		title: 'The Beginning of an Incredable Journey',
		desc: 'The thrill of travelling starts with the excitement on decideng where to go next'
	},
	{
		title: 'The Beginning of an Incredable Journey',
		desc: 'The thrill of travelling starts with the excitement on decideng where to go next'
	},
]

export const baseUrl = 'https://www.sunclubrewards.com/en/api'

export const serverUrls = {
	login: {url: '/user_login', method: 'POST'},
	countries: {url: '/get_countries', method: 'POST'},
	provinces: {url: '/get_provinces', method: 'POST'},
	cities:  {url: '/get_cities', method: 'POST'},
	checkPromoCode:  {url: '/check_promocode', method: 'POST'},
	singup:  {url: '/user_reg', method: 'POST'},
	getUser:  {url: '/get_user', method: 'POST'},
	forgotPassword:  {url: '/retrieve_password', method: 'POST'},
	forgotNumber:  {url: '/retrieve_number', method: 'POST'},
	changePassword:  {url: '/change_password', method: 'POST'},
	editProfile:  {url: '/edit_profile', method: 'POST'},
	listOffers:  {url: '/list_offers', method: 'POST'},
	addProductRecord:  {url: '/add_product_record', method: 'POST'},
	listStatements:  {url: '/list_states', method: 'POST'},
	changePinCode:  {url: '/change_pin', method: 'POST'},
	forgotPinCode:  {url: '/forget_pin', method: 'POST'},
	getCardImage:  {url: '/get_card', method: 'POST'},
}

// list of white listed params for back end. The key of params is type of action that is used in redux
export const whiteListParams = {
	SINGUP: ['fname', 'Mname', 'lname', 'email', 'password', 'gender', 'dob', 'apt', 'stnum', 'stname', 'address2', 'country', 'province', 'city', 'zip', 'PromoCode'],
	PROVINCES: ['country_id'],
	LOGIN: ['email', 'password'],
	FORGOTPASSWORD: ['email'],
	FORGOTNUMBER: ['email'],
	LOGIN: ['email', 'password'],
	LISTOFFERS: ['user_id', 'email'],
	USER: ['user_id', 'email'],
	CHANGEPASSWORD: ['user_id', 'email', 'password', 'new_password'],
	CHANGEPINCODE: ['user_id', 'email', 'oldpincode', 'pincode'],
	CARDIMAGE: ['user_id', 'email'],
	EDITPROFILE: ['user_id', 'fname', 'Mname', 'lname', 'email', 'password', 'gender', 'dob', 'apt', 'stnum', 'stname', 'address2', 'country', 'province', 'city', 'zip', 'UserProfilePic'],
	FORGETPINCODE: ['user_id', 'email']
}

// list of required params for UX
export const requiredList = {
	register1: ['firstName', 'lastName', 'email', 'password', 'birthday', 'country', 'province', 'city', 'zip', 'confirmPassword'],
	register2: ['country', 'province', 'city', 'zipCode'],
	login: ['login', 'password'],
	forgotPassword: ['login'],
	forgotNumber: ['login'],
	login: ['login', 'password'],
	changePassword: ['oldPassword', 'newPassword', 'repeatPassword'],
	changePinCode: ['oldPinCode', 'newPinCode', 'confirmPinCode'],
	forgotPassword: ['login'],
	forgotNumber: ['login'],
	info: ['firstName', 'lastName', 'email', 'birthday', 'country', 'province', 'city', 'zip'],
}

// adapter params to convert key of params from client to params for back end (params from client are keys, and params for back ed are values). The key of params is type of action that is used in redux
export const adapterKeyParams = {
  SINGUP: {
    firstName: 'fname',
    middleName: 'Mname',
    lastName: 'lname',
    birthday: 'dob',
    appartmentNumber: 'apt',
    streetNumber: 'stnum',
    streetName: 'stname',
    zipCode: 'zip',
		promotionCode: 'PromoCode',
		address: 'address2'
	},
	PROVINCES: {
		country: 'country_id'
	},
	CITIES: {
		country: 'country_id',
		province: 'province_id'
	},
	FORGOTPASSWORD: {
		login: 'email'
	},
	FORGOTNUMBER: {
		login: 'email'
	},
	LOGIN: {
		login: 'email'
	},
	CHANGEPASSWORD: {
		oldPassword: 'password',
		repeatPassword: 'new_password'
	},
	CHANGEPINCODE: {
		oldPinCode: 'oldpincode',
		confirmPinCode: 'pincode'
	},
	EDITPROFILE: {
		firstName: 'fname',
    middleName: 'Mname',
    lastName: 'lname',
    birthday: 'dob',
    appartmentNumber: 'apt',
    streetNumber: 'stnum',
    streetName: 'stname',
    zipCode: 'zip',
		avatarSource: 'UserProfilePic',
		address: 'address2'
	},
}

export const faqContent = [
  {
		title: 'How do I become a SunClub member?',
		text: 'It\'s easy and FREE! Simply sign up at SunClubRewards.com. Your membership number will be issued as soon as you click on the email confirmation link we provide after you sign up.'
  },
  {
		title: 'What are the benefits of SunClub Rewards membership? Why should I join?',
		text: 'SunClub Rewards makes it easy for you to earn points towards your next holiday or vacation. You earn points for purchases in the SunClub Online Mall, at participating retail locations, or by booking your next vacation with SunClubVacations.com. A minimum of One (1) SunClub Reward point is awarded for every net dollar spent. SunClub Reward points never expire, and earn interest at 2% per annum until you are ready to redeem. If you do not wish to make a travel purchase, you have the flexibility of redeeming your points by requesting a Prepaid Visa card, which you can use anywhere Visa is accepted.'
  },
  {
    title: 'When can I start collecting points?',
    text: 'You can start collecting points as soon as you sign up! New members get bonus points upon signup. To receive your bonus points input the applicable Promo Code given. As soon as you get your new membership number, you can start building up your points simply by making everyday purchases with our affiliate merchants, or by booking travel with SunClub Vacations. Build up your points balance faster with our weekly Bonus Points offers and special promotions.'
  },
  {
		title: 'Where can I use my SunClub Rewards card?',
		text: 'Use your SunClub Rewards membership to book your next holiday or vacation with SunClub Vacations. You can also use your SunClub Rewards membership when you make purchases with our affiliate merchants. Every net dollar you spend earns one (1) SunClub point to use towards future travel. The more you use your SunClub Rewards card, the more points you earn towards your next vacation. Members get regular e-newsletters with Bonus Point offers and special promotions, which increase your chances of earning points faster. You can also check out the Promotions link on our website to learn more. Please note that when making purchases with SunClub Online Mall merchants, you MUST click and use the affiliate link provided in the e-newsletter sent to you or in the Promotions page. This is the only way we can track and credit your points after your purchase. If you do not click the direct link provided we are not able to credit your points.'
  },
  {
		title: 'How much are my SunClub Rewards points worth?',
		text: 'SunClub Rewards members receive a minimum of one (1) point for every net dollar spent. Each SunClub Rewards point has a cash value of $0.015. (ex. 500 points = $7.50, 5000 points = $75.00.) Unused points earn interest at a rate of 2% per annum.'
  },
  {
    title: 'How can I redeem my SunClub Rewards points?',
    text: 'Use your SunClub Rewards points for travel purchases booked through SunClub Vacations. Points for travel can also be applied towards taxes, fuel surcharges or airport fees up to the cash value of your points. If you are short you may pay the different with your credit card. If you do not wish to use your points for travel, you may request a Prepaid Visa card which you have the flexibility to use wherever Visa is accepted. A minimum of $50 value in SunClub points is required for the issuance of a Prepaid Visa Card as well as enough points to cover the activation fees: $50 - $5.95, $75 - $6.50, $100 - $6.95, $150 - $7.50, $250 and above - $7.90'
  },
  {
		title: 'Can I buy points?',
		text: 'Yes. If you want to give the gift of travel, SunClub Rewards points may be purchased at $0.025 per point, payable by credit card. Points do not expire and earn interest at 2% per annum until they are redeemed. There is a small administration fee charged on point purchases.'
	},
	{
		title: 'How do I view my transaction history?',
		text: 'Your current points balance and a list of your most recent transactions that have been posted can be viewed by clickingSIGN IN on the SunClub Rewards homepage.'
	},
	{
		title: 'How long does it take to receive my SunClub Rewards points after a purchase?',
		text: 'The length of time varies by affiliate merchant and their time limits for merchandise returns and/or cancellations. Usually it takes 3 weeks to receive your rewards points. Points earned from SunClub Vacations bookings are credited after full payment is received for your holiday purchase and completion of your vacation.'
	},
	{
		title: 'If I book a family vacation, will I also receive points for my family members	as well as my own?',
		text: 'You will receive SunClub Rewards points on the total amount spent (for each individual you paid for as well as yourself).'
	},
	{
		title: 'What if I lose my SunClub Rewards membership card?',
		text: ['Call us at 604-559-8837', 'Toll-Free', 'info@sunclubrewards.com']
	}
]

export const adapterValueParams = {
	SINGUP: {
		birthday: (dateString) => moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD')
	},
	EDITPROFILE: {
		birthday: (dateString) => moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		avatar: (string) => string.replace('data:image/jpeg;base64,', '')
	}
}


