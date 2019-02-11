import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux'
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import ImageLoad from 'react-native-image-placeholder'

import { width, heigh, menuItems } from 'constants/config'

class MenuItem extends PureComponent {
  renderIconOrImage = (image, icon) => {
    if (image) {
      return (
        <Image source={image} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
      )
    }
  }

  render() {
    const { handleMenuItemAction, text, icon, image, action, active, isLast } = this.props
    return (
      <TouchableOpacity disabled={action == 'no'} style={[isLast && {marginTop: width(8)}]} onPress={() => handleMenuItemAction(action)}>
        <View style={[styles.menuItemWrapper, action == 'no' && {opacity: 0.4}]}>
          <View style={[styles.menuItemIconWrapper]}>
            {this.renderIconOrImage(image, icon)}
          </View>
          <View style={styles.menuItemTextWrapper}>
            <Text style={styles.menuItemText}>{text}</Text>
          </View>  
        </View>
      </TouchableOpacity>
    );
  }
}

@connect(
  state => ({
    drawer: state.drawer,
    user: state.user
  }),
  dispatch => ({
    triggerDrawer: () => {
      dispatch(ApiUtils.triggerDrawer())
    },
  })
)
export default class CustomDrawerContentComponent extends Component {
  componentWillReceiveProps(nextProps) {
    
  }
  
  handleMenuItemAction = (action) => {
    const { navigation } = this.props
    switch (action) {
      case 'logout':
        navigation.navigate('Login')
        break
      default:
        navigation.navigate(action)
    }
  }

  render() {
    const { navigation, user } = this.props
    const userData = user && user.response && user.response.user_data
    return (
      <ScrollView style={styles.container}>
        <View style={styles.topPart}>
          <View style={styles.avatarWrapper}>
            <ImageLoad
              style={styles.avatarImage}
              isShowActivity={false}
              placeholderSource={require('images/avatarPlaceholder.png')}
              source={{ uri: userData.UserProfilePic }}/>  
          </View>
          {
            userData
              ? < Text style={styles.nameText}>{userData.fname + ' ' + userData.lname}</Text>
              : null
          }
        </View>
        <View style={styles.bottomPart}>
          {
            menuItems && menuItems.map((menuItem, idx) => {
              const active = navigation.state.routes[navigation.state.index].routeName == menuItem.action
              return (
                <MenuItem
                  key={menuItem.action + '_' + idx}
                  idx={idx}
                  isLast={idx == menuItems.length - 1}
                  active={active}
                  handleMenuItemAction={this.handleMenuItemAction}
                  {...menuItem} />
              )
            })
          }  
        </View>  
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  menuItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: width(5),
    paddingVertical: width(2.4)
  },
  menuItemIconWrapper: {
    width: width(7),
    height: width(7),
    padding: width(1.1),
  },
  menuItemTextWrapper: {
    marginLeft: width(4),
  },
  menuItemText: {
    color: 'black',
    fontSize: width(4.6),
    fontWeight: '600'
  },


  topPart: {
    height: width(70),
    backgroundColor: '#327CC0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarWrapper: {
    height: width(32),
    width: width(32),
    borderRadius: width(32),
    overflow: 'hidden'
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  nameText: {
    color: 'white',
    fontSize: width(5.4),
    marginTop: width(4),
    fontWeight: '800'
  },
  bottomPart: {
    marginTop: width(5)
  }
})