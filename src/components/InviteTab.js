import React, { Component } from 'react';
import { View, Text, StyleSheet, Clipboard } from 'react-native'
import { connect } from 'react-redux'

import { width, height } from 'constants/config'

import StdBtn from 'components/StdBtn'

@connect(
  state => ({
    user: state.user,
  }),
  dispatch => ({
  })
)
export default class InviteTab extends Component {
  constructor(props) {
    super(props);
    const userData = props.user && props.user.response && props.user.response.user_data
    console.log(userData)
    this.state = {
      refId: userData && userData.ReferalID
    }
  }
  
  copyRefId = (refId) => {
    Clipboard.setString('http://www.sunclubrewards.com/en/register/index/ref_' + refId);
  }
  
  render() {
    const { refId } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.postWrapper}>
          <Text style={styles.titleText}>
            Referral Link
          </Text>
          <Text multiline={true} style={styles.linkText}>
            {
              refId
                ? 'http://www.sunclubrewards.com/en/register/index/ref_' + refId
                : ''
            }
          </Text>
          <Text multiline={true} style={styles.otherText}>
            Introduce SunClub Rewards to your friends and earn bonus reward points. Send the above link to your friends and once they sign up and become a member of SunClub Rewards your account will be credit with 250 SunClub points. This promo is limited to 3 friend referals.
          </Text>  
        </View>
        <View style={styles.copyLinkBtnWrapper}>
          <StdBtn 
            text="Copy link"
            action={() => this.copyRefId(refId)}
            heightlighted={true} /> 
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  postWrapper: {
    marginTop: width(6),
    marginHorizontal: width(8)
  },
  titleText: {
    color: '#CFCFCF',
    fontSize: width(4.6),
  },
  linkText: {
    marginTop: width(2),
    fontSize: width(5.2),
    lineHeight: width(5.5),
    fontFamily: 'Helvetica'
  },
  otherText: {
    marginTop: width(2),
    fontSize: width(4.6),
    fontFamily: 'Helvetica',
    lineHeight: width(5.5)
  },
  copyLinkBtnWrapper: {
    marginHorizontal: width(8),
    height: width(12),
    marginTop: width(6)
  }
})