import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Barcode from 'react-native-barcode-builder';
import Orientation from 'react-native-orientation';

import { widthForOr, heightForOr, iconImages, serverUrls } from 'constants/config'
import { checkNextProps } from 'utils/index'

import fetchServ from 'actions/fetchServ'

import NavBar from 'components/NavBar'

@connect(
  state => ({
    user: state.user,
    cardImage: state.cardImage
  }),
  dispatch => ({
    fetchCardImage: (params) => {
      dispatch(fetchServ(serverUrls.getCardImage, params, 'CARDIMAGE'))
    },
  })
)
export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardImageUrl: '',
      orientation: Orientation.getInitialOrientation(),
      showBarcode: true
    }
  }

  componentWillMount() {
    const { user, fetchCardImage } = this.props
    const userData = user && user.response && user.response.user_data
    Orientation.unlockAllOrientations();
    userData && fetchCardImage({
      user_id: userData.user_id,
      email: userData.email
    })
    Orientation.getOrientation((err, orientation) => {
      this.setState({orientation})
    });
  }

  componentDidMount() {
    Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT'
      this.setState({ orientation }, () => {
        this.setState({showBarcode: false})
        setTimeout(() => {
          this.setState({showBarcode: true})
        },50)
      })
    })
  }

  componentWillUnmount() {
    Orientation.lockToPortrait()
  }
  
  
  componentWillReceiveProps(nextProps) {
    const propsGetCardImage = checkNextProps(nextProps, this.props, 'cardImage')
    if (propsGetCardImage && propsGetCardImage != 'empty') {
      const cardImageUrl = nextProps.cardImage.response.card;
      this.setState({
        cardImageUrl: cardImageUrl,
        isLoading: false,
      });
      if (nextProps.cardImage.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.cardImage.response.msg)
        })
      }
    } else if (propsGetCardImage == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }
  
  render() {
    const { navigation, user } = this.props
    const { cardImageUrl, orientation, showBarcode } = this.state
    const userData = user && user.response && user.response.user_data
    const navBarProps = {
      leftPart: {
        image: iconImages.menuIcon,
        action: () => navigation.navigate('DrawerOpen')
      },
      centerPart: {
        text: userData && userData.Points
          ? userData.fname + ' ' + userData.lname
          : ''
      },
      rightPart: {
        text: userData && userData.Points
          ? userData.Points + ' points'
          : '0 p'
      }
    }
    const barcode = userData && String(userData.card_number)
    const styles = stylesOrientation(Orientation.getInitialOrientation(), orientation)
    const port = orientation == 'PORTRAIT'
    return (
      <ScrollView style={styles.container}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.mainContentWrapper}>
          <View style={styles.cardWrapper}>
            {
              cardImageUrl
                ? <Image style={styles.cardImage} source={{uri: cardImageUrl}}/>
                : null
            }
          </View>
          <View style={styles.barcodeWrapper}>
            {
              barcode && showBarcode
                ? <Barcode ref={comp => this.barcode = comp} width={port?2:3} value={barcode} format="CODE128" />
                : null
            }  
            <Text style={styles.barcodeText}>{userData.card_number}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const stylesOrientation = (initialKey, key) => {
  const port = key == 'PORTRAIT'
  const width = widthForOr(initialKey, key)
  const height = heightForOr(initialKey, key)
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContentWrapper: {
      alignItems: 'center'
    },
    cardWrapper: {
      width: width(80),
      height: width(50),
      marginTop: width(12),
      overflow: 'hidden'
    },
    cardImage: {
      height: '100%',
      width: '100%',
      resizeMode: 'stretch'
    },
    barcodeWrapper: {
      marginTop: width(10),
      // width: width(50),
      // height: width(30)
    },
    barcodeText: {
      fontSize: width(5.4),
      textAlign: 'center'
    },
    barcodeImage: {
      height: '100%',
      width: '100%',
      marginTop: width(12)
    },
  })
}

