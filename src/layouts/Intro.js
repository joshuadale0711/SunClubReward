import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native'
import { connect } from 'react-redux'

import { width, height, serverUrls } from 'constants/config'

import Loading from 'components/Loading'

import fetchServ from 'actions/fetchServ'

@connect(
  state => ({
    user: state.user,
    countries: state.countries
  }),
  dispatch => ({
    fetchCountries: (params) => {
      dispatch(fetchServ(serverUrls.countries, params, 'COUNTRIES'))
    },
  })
)
class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {
    const { fetchCountries, user, countries } = this.props
  }
  
  render() {
    return (
      <View>
        
      </View>
    );
  }
}

export default Intro;