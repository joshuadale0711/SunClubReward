import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import { connect } from 'react-redux'

import { height, width, iconImages } from 'constants/config'
import { checkNextProps } from 'utils'

import NavBar from 'components/NavBar'
import AccauntTopBar from 'components/AccauntTopBar'

// import content components
import ProfileTab from 'components/ProfileTab'
import ChangePasswordTab from 'components/ChangePasswordTab'
import ChangePinCodeTab from 'components/ChangePinCodeTab'
import InviteTab from 'components/InviteTab'

@connect(
  state => ({
    user: state.user,
  }),
  dispatch => ({
  })
)
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAction: ''
    }
  }

  handleBtnPress = (action) => {
    this.setState({activeAction: action})
  }

  renderMainContent = (activeAction) => {
    switch (activeAction) {
      case 'profile':
        return <ProfileTab />
      case 'changePassword':
        return <ChangePasswordTab />
      case 'pinCode':
        return <ChangePinCodeTab />
      case 'invite':
        return <InviteTab />
      default:
        return <ProfileTab />
    }
  }

  render() {
    const { navigation, user } = this.props
    const { activeAction } = this.state
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
    const accountTopBarProps = {
      activeAction,
      handleBtnPress: this.handleBtnPress
    }
    return (
      <View style={styles.container}>
        <NavBar {...navBarProps} navigation={navigation}/>  
        <View style={styles.mainContentWrapper}>  
          <AccauntTopBar {...accountTopBarProps} />
          {this.renderMainContent(activeAction)}
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
    flex: 1,
  }
})
