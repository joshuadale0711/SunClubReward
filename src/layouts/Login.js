import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, ImageBackground, Model, Text, Image } from 'react-native'
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux'

import { width, height, swiperContent, serverUrls, isIphoneX } from 'constants/config'
import fetchServ from 'actions/fetchServ'

import Loading from 'components/Loading'
import StdBtn from 'components/StdBtn'
import LoginModal from 'components/LoginModal'

//navigator for login
import LoginNavigator from 'api/LoginNavigator'

class TextSwiper extends PureComponent {
  render() {
    return (
      <Swiper
        dot={Dot}
        activeDot={ActiveDot}
        loop={false}
        style={styles.textSwiperWrapper} 
        horizontal={true}
        showsButtons={false}>
        {
          swiperContent && swiperContent.length && swiperContent.map((swiperContentItem, idx) => (
            <View key={'swiperContent_' + idx} style={styles.slideWrapper}>
              <Text multiline={true} style={styles.slideTitleText}>{swiperContentItem.title}</Text>
              <Text multiline={true} style={styles.slideDescText}>{swiperContentItem.desc}</Text>
            </View>
          ))
        }
      </Swiper>
    );
  }
}

@connect(
  state => ({
  }),
  dispatch => ({
    fetchСountries: (params) => {
      dispatch(fetchServ(serverUrls.countries, params, 'COUNTRIES'))
    },
  })
)
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mode: 'default',
      showModal: false,
      errorFieldName: '',
    }
  }

  componentWillMount() {
    const { fetchСountries } = this.props
    fetchСountries()
  }

  triggerMode = (mode) => {
    switch (mode) {
      case 'default':
        this.setState({showModal: false}, () => {
          setTimeout(() => {
            this.setState({mode: 'default'})
          }, 300)
        })
        break
      case 'modal':
        this.setState({mode: 'modal'}, () => {
          setTimeout(() => {
            this.setState({showModal: true})
          }, 200)
        })
        break
    }
  }

  register = () => {
    const { navigation } = this.props
    navigation.navigate('Register1')
  }
  
  renderMainContent = () => {
    const { navigation } = this.props
    const { loading, mode, showModal } = this.state
    if (loading) return <Loading />
    switch (mode) {
      case 'default':
        return (
          <View style={[styles.mainContentWrapper, { justifyContent: 'space-between' },  isIphoneX && {paddingTop: width(10)}]}>
            <View style={styles.topPartWrapper}>
              <Text multiline={true} style={styles.topText}>The Beginning of an Incredible Journey</Text>
            </View>  
            <View style={styles.bottomPart}>
              <View style={styles.logoWrapper}>
                <Image style={styles.logoImage} source={require('images/logo.png')} />
              </View>
              <Text style={styles.introText}>It's simple and absolutely free!</Text>
              <View style={styles.btnsWrapper}>
                <StdBtn 
                  text="Login"
                  width={width(42)}
                  action={() => this.triggerMode('modal')}
                  heightlighted={true} />
                <StdBtn 
                  text="Join today"
                  width={width(42)}
                  action={this.register}
                  heightlighted={false} />
              </View>
            </View>
          </View>  
        )
      case 'modal':
        return (
          <View style={styles.mainContentWrapper}>
            <LoginModal handleClose={() => this.triggerMode('default')} show={showModal} >
              <LoginNavigator handleClose={() => this.triggerMode('default')} appNavigationProps={navigation}/>
            </LoginModal>
          </View>
        )
      default: 
        return null  
    }
  }
  render() {
    const { loading } = this.state
    return (
      <View style={styles.container}>
        <ImageBackground 
          resizeMethod="scale" 
          resizeMode="cover" 
          style={styles.backgroundImage} 
          source={
            loading
              ? require('images/loginLayout.png')
              : require('images/loginLayout.png')
          } >
          {this.renderMainContent()}
        </ImageBackground>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    height: '100%',
    width: '100%'
  },
  mainContentWrapper: {
    width: width(100),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialWrapper: {
    height: height(44),
    width: width(90)
  },
  btnsWrapper: {
    marginTop: width(5),
    marginBottom: width(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: width(12),
    width: width(90),
  },


  textSwiperWrapper: {

  },
  slideWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitleText: {
    textAlign: 'center',
    fontSize: width(6.5),
    color: 'white',
    fontWeight: '700',
    lineHeight: width(8)
  },
  slideDescText: {
    marginTop: width(12),
    textAlign: 'center',
    fontSize: width(5),
    color: 'white',
    lineHeight: width(8)
  },


  dot: {
    backgroundColor:'#B9B9B9',
    width: 6,
    height: 6,
    borderRadius: 6, 
    margin: 10
  },
  activeDot: {
    backgroundColor:'transparent', 
    width: 12, 
    height: 12,
    borderRadius: 12, 
    margin: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'solid'
  },
  logoWrapper: {
    width: width(48),
    height: width(25)
  },
  logoImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'stretch'
  },
  introText: {
    marginTop: width(3),
    fontSize: width(6),
    color: '#298FC8'
  },
  topPart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    fontSize: width(9),
    color: 'white',
    marginHorizontal: width(12),
    marginTop: width(5),
    textAlign: 'center',
    lineHeight: width(12)
  }
})
const Dot = <View style={styles.dot} />
const ActiveDot = <View style={styles.activeDot} />

// <View style={styles.tutorialWrapper}>
//               <TextSwiper />
//             </View>
