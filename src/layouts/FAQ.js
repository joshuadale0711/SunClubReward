import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, Animated, Platform, Linking } from 'react-native'
import { connect } from 'react-redux'

import { height, width, iconImages, faqContent, isIphoneX } from 'constants/config'
import { checkNextProps } from 'utils'

import NavBar from 'components/NavBar'

class FAQItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullHeight: false
    }
  }
  
  triggerHeight = () => {
    this.setState({fullHeight: !this.state.fullHeight})
  }

  render() {
    const { item, idx } = this.props
    const { fullHeight } = this.state
    return (
      <TouchableOpacity key={'faqRow_' + idx} onPress={this.triggerHeight}>
        <View style={styles.itemWrapper}>
          <Text style={styles.title}>
            {item.title}
          </Text>
          {
            fullHeight
              ? item.text 
                ? (typeof item.text == 'string')
                  ? <Text multiline={true} style={styles.desc}>
                      {item.text}
                    </Text>
                  : <View>
                    {
                      item.text.map((itemText, itemTextIdx) => (<Text key={idx+'_'+itemTextIdx} multiline={true} style={styles.desc}>
                        {itemText}
                      </Text>))
                    }
                  </View>
                : null
              : null
          }
        </View>
      </TouchableOpacity>
    )
  }
}

export default class FAQ extends Component {
  _keyExtractor = (item, idx) => idx;

  renderItem = ({ item, index }) => {
    return <FAQItem item={item} idx={index} />
  }

  render() {
    const { navigation } = this.props
    const navBarProps = {
      leftPart: {
        image: iconImages.menuIcon,
        action: () => navigation.navigate('DrawerOpen')
      },
      centerPart: {
        text: 'FAQ'
      },
      rightPart: {
        image: iconImages.mailNavBarIcon,
        action: () => Linking.openURL('mailto:info@sunclubrewards.com')
      }
    }
    return (
      <View style={[styles.container, isIphoneX && {paddingBottom: width(4)}]}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.mainContent}>
          <FlatList
            data={faqContent}
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
    flex: 1
  },
  mainContent: {
    flex: 1,
    marginHorizontal: width(2),
    paddingVertical: width(1)
  },
  itemWrapper: {
    borderTopColor: 'transparent',
    shadowColor: Platform.OS == 'ios' 
      ? '#000'
      : '#000',
    shadowOffset: { width: 0, height: Platform.OS == 'ios' ? 1 : 1 },
    shadowOpacity: Platform.OS == 'ios' 
      ? 0.4
      : 0.4,
    shadowRadius: Platform.OS == 'ios' 
      ? 1
      : 1,
    paddingHorizontal: width(3),
    paddingVertical: width(2),
    borderColor: '#F6F6F6',
    borderWidth: Platform.OS == 'ios'
      ? 2
      : 2,
    borderStyle: 'solid',
    marginVertical: width(1),
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: width(5.2),
    fontWeight: '400'
  },
  desc: {
    fontSize: width(4),
    marginTop: width(2),
    lineHeight: width(6)
  }
})