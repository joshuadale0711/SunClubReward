import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, Linking } from 'react-native'
import { connect } from 'react-redux'
import ImageLoad from 'react-native-image-placeholder'

import { height, width, iconImages, serverUrls } from 'constants/config'
import { checkNextProps } from 'utils'

import fetchServ from 'actions/fetchServ'

import NavBar from 'components/NavBar'

const fakeData = [
  {
    image: require('images/itemImage.png'),
    title: 'Earn 100 SunClub Rewards',
    text: 'Shop for all your household needs and earn up to 4% in points!'
  },
  {
    image: require('images/itemImage.png'),
    title: 'Earn 100 SunClub Rewards',
    text: 'Shop for all your household needs and earn up to 4% in points!'
  },
  {
    image: require('images/itemImage.png'),
    title: 'Earn 100 SunClub Rewards',
    text: 'Shop for all your household needs and earn up to 4% in points!'
  },
  {
    image: require('images/itemImage.png'),
    title: 'Earn 100 SunClub Rewards',
    text: 'Shop for all your household needs and earn up to 4% in points!'
  },
  {
    image: require('images/itemImage.png'),
    title: 'Earn 100 SunClub Rewards',
    text: 'Shop for all your household needs and earn up to 4% in points!'
  },
  {
    image: require('images/itemImage.png'),
    title: 'Earn 100 SunClub Rewards',
    text: 'Shop for all your household needs and earn up to 4% in points!'
  },
]

@connect(
  state => ({
    user: state.user,
    listOffers: state.listOffers,
    addProduct: state.addProduct
  }),
  dispatch => ({
    fetchOffers: (params) => {
      dispatch(fetchServ(serverUrls.listOffers, params, 'LISTOFFERS'))
    },
    fetchAddProduct: (params) => {
      dispatch(fetchServ(serverUrls.addProductRecord, params, 'ADDPRODUCT'))
    },
  })
)
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOffers: [],
      itemPressed: null
    }
  }

  componentDidMount() {
    const { fetchOffers, user } = this.props
    const userData = user && user.response && user.response.user_data
    userData && fetchOffers({
      user_id: userData.user_id,
      email: userData.email
    })
  }
  

  componentWillReceiveProps(nextProps) {
    const propsCheckerListOffers = checkNextProps(nextProps, this.props, 'listOffers')
    if (propsCheckerListOffers && propsCheckerListOffers != 'empty') {
      const listOffers = nextProps.listOffers.response.offers;
      this.setState({
        listOffers: listOffers,
        isLoading: false,
      });
    } else if (propsCheckerListOffers == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
    const propsAddProduct = checkNextProps(nextProps, this.props, 'addProduct')
    if (propsAddProduct && propsAddProduct != 'empty') {
      const { itemPressed } = this.state
      const listOffers = nextProps.addProduct.response.offers;
      this.setState({ itemPressed: null })
      if (itemPressed) {
        Linking.openURL(itemPressed.ProductLink)
      }
    } else if (propsAddProduct == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }
  
  _keyExtractor = (item, idx) => idx;

  onItemPress = (item) => {
    const { fetchAddProduct, user } = this.props
    const { itemPressed } = this.state
    const userData = user && user.response && user.response.user_data
    this.setState({ itemPressed: item })
    if (!itemPressed) {
      userData && fetchAddProduct({
        user_id: userData.user_id,
        pro_id: item.id
      })
    }
  }


  renderItem = ({ item }) => {
    const { itemPressed } = this.state
    return (
      <TouchableOpacity onPress={
        itemPressed
          ? null
          : () => this.onItemPress(item)
        }>
        <View style={styles.itemWrapper}>
          <View style={styles.imageWrapper}>
            <ImageLoad
              style={styles.image}
              isShowActivity={false}
              customImagePlaceholderDefaultStyle={styles.image}
              placeholderSource={require('images/offerPlaceholder.png')}
              source={{ uri: item.RetailerImage }}/>
          </View>
          <View style={styles.rightPart}>
            <Text style={styles.title}>
              {item.RetailerName}
            </Text>  
            <Text style={styles.desc}>
              {item.ProductDescription}
            </Text>
            <Text style={styles.earnPointsText}>
              {
                item.ProductMiles
                  ? 'Earn ' + item.ProductMiles + ' Sunclub Rewards Points'
                  : ''
              }
            </Text>
          </View>  
        </View>
      </TouchableOpacity>
    )
  }
  
  render() {
    const { navigation, user } = this.props
    const { listOffers } = this.state
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
    return (
      <View style={styles.container}>
        <NavBar {...navBarProps} navigation={navigation}/>  
        <View style={styles.mainContentWrapper}>  
          <FlatList
            data={listOffers}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            style={{flex:1}}
            renderItem={this.renderItem} />
        </View>
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContentWrapper: {
    flex: 1
  },
  itemWrapper: {
    paddingVertical: width(4),
    paddingHorizontal: width(4),
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: width(100)
  },
  imageWrapper: {
    height: width(30),
    width: width(30),
    borderRadius: 6,
    overflow: 'hidden'
  },
  image: {
    height: '100%',
    width: '100%'
  },
  rightPart: {
    marginLeft: width(4),
    flexShrink: 1
  },
  title: {
    fontSize: width(5.4),
    flexShrink: 1
  },
  desc: {
    marginTop: width(3),
    fontSize: width(4.2),
    flexShrink: 1
  },
  earnPointsText: {
    marginTop: width(1),
    fontSize: width(3.6),
    flexShrink: 1
  }
})
