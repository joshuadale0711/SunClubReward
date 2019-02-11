import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import { height, width, iconImages, serverUrls } from 'constants/config'
import { checkNextProps } from 'utils'

import NavBar from 'components/NavBar'

let fakeData = [
  {
    points: 500,
    type: 'Debit',
    description: 'Reedem',
    amount: '$7,5',
    date: '2017-11-15'
  },
  {
    points: 300,
    type: 'Credit',
    description: 'Monthly Interrests',
    amount: '$0,03',
    date: '2017-11-15'
  },
  {
    points: 500,
    type: 'Debit',
    description: 'Reedem',
    amount: '$7,5',
    date: '2017-11-15'
  },
  {
    points: 500,
    type: 'Debit',
    description: 'Reedem',
    amount: '$7,5',
    date: '2017-11-15'
  },
  {
    points: 500,
    type: 'Debit',
    description: 'Reedem',
    amount: '$7,5',
    date: '2017-11-15'
  },
  {
    points: 500,
    type: 'Debit',
    description: 'Reedem',
    amount: '$7,5',
    date: '2017-11-15'
  },
]

const headData = {
  points: 'Points',
  type: 'Type',
  description: 'Description',
  amount: 'Amount',
  date: 'Date'
}

@connect(
  state => ({
    user: state.user,
    listStatements: state.listStatements
  }),
  dispatch => ({
    fetchListStatements: (params) => {
      dispatch(fetchServ(serverUrls.listStatements, params, 'LISTSTATEMENTS'))
    },
  })
)
export default class Statements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      listStatements: []
    }
  }

  componentWillMount() {
    const { fetchListStatements, user } = this.props
    const userData = user && user.response && user.response.user_data
    userData && fetchListStatements({
      user_id: userData.user_id,
      email: userData.email
    })
  }

  
  componentWillReceiveProps(nextProps) {
    const propsListStatements = checkNextProps(nextProps, this.props, 'listStatements')
    if (propsListStatements && propsListStatements != 'empty') {
      const listStatements = nextProps.listStatements.response.points;
      this.setState({
        listStatements: listStatements,
        isLoading: false,
      });
      if (nextProps.listStatements.response.msg) {
        this.setState({isLoading: false}, () => {
          Alert.alert(nextProps.listStatements.response.msg)
        })
      }
    } else if (propsListStatements == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }

  _keyExtractor = (item, idx) => idx;

  renderItem = ({ item, index }) => {
    const data = index == 0
      ? item.date
      : moment(item.createdAt, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
    return (
      <View style={styles.itemWrapper}>
        <View style={[styles.cellWrapper, index == 0 && styles.cellWrapperFullBorder]}>
          <Text style={[styles.cellText]}>
            {
              index == 0
                ? item.points
                : item.Point
            }  
          </Text>  
        </View>  
        <View style={[styles.cellWrapper, index == 0 && styles.cellWrapperFullBorder]}>
          <Text style={[styles.cellText]}>
            {
              index == 0
                ? item.type
                : item.PointType
            }
          </Text>  
        </View>  
        <View style={[styles.cellWrapper, index == 0 && styles.cellWrapperFullBorder]}>
          <Text style={[styles.cellText]}>
            {
              index == 0
                ? item.description
                : item.Reason
            }
          </Text>  
        </View>  
        <View style={[styles.cellWrapper, index == 0 && styles.cellWrapperFullBorder]}>
          <Text style={[styles.cellText, index != 0 && styles.cellAmountText]}>
            {
              index == 0
                ? item.amount
                : '$ ' + (item.Point * 0.015)
            }
          </Text>  
        </View>  
        <View style={[styles.cellWrapper, styles.cellWrapperLast, index == 0 && styles.cellWrapperFullBorder, index == 0 && styles.cellWrapperFullBorderLast]}>
          <Text style={[styles.cellText]}>
            {data}
          </Text>  
        </View>  
      </View>
    )
  }

  render() {
    const { navigation, user } = this.props
    const { listStatements } = this.state
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
    const credit = userData && (0.015 * userData.Points)
    return (
      <View style={styles.container}>
        <NavBar {...navBarProps} navigation={navigation}/>    
        <View style={styles.mainContentWrapper}>
          <View style={styles.topPartWrapper}>
            <View style={styles.creditWrapper}>
              <Text style={styles.creditText}>
                Credit:
              </Text>
              <Text style={styles.creditNumber}>
                {
                  credit
                    ? '$ ' + credit
                    : ''
                }
              </Text>
            </View>  
            <View style={styles.balanceWrapper}>
              <Text style={styles.balanceText}>
                Point Balance:
              </Text>
              <Text style={styles.balanceNumber}>
                {
                  userData && userData.Points
                    ? userData.Points + ''
                    : '0'
                }
              </Text>
            </View>  
          </View>
          <View style={styles.listWrapper}>
            <FlatList
              data={[{ ...headData }, ...listStatements]}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              style={{flex:1}}
              renderItem={this.renderItem} />
          </View>  
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContentWrapper: {
    
  },
  topPartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: width(6),
    marginHorizontal: width(6)
  },
  creditWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  creditText: {
    fontSize: width(5)
  },
  creditNumber: {
    fontSize: width(5),
    marginLeft: width(1)
  },
  balanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  balanceText: {
    fontSize: width(5)
  },
  balanceNumber: {
    fontSize: width(5),
    marginLeft: width(1)
  },
  listWrapper: {
    marginTop: width(6),
    height: '100%',
    width: '100%'
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  cellWrapper: {
    flex: 1,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E6E6E6',
  },
  cellWrapperLast: {
    borderRightWidth: 0,
  },
  cellWrapperFullBorder: {
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
    borderBottomColor: '#E6E6E6',
    borderStyle: 'solid'
  },
  cellWrapperFullBorderLast: {
    borderRightWidth: 0,
  },
  cellText: {
    marginLeft: width(1.4),
    fontSize: width(3.2),
    paddingVertical: width(2),
  },
  cellAmountText: {

  }
})