import axios from 'axios'
import pinch from 'react-native-pinch';
import { Platform } from 'react-native'
import { baseUrl } from 'constants/config'

export default DAO = {
  request({url, method}, params) {
    return new Promise((resolve, reject) => {
      const fetchParams = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        data: method == 'POST'
          ? params
          : null
      }
      console.log('doing a request')
      console.log(url)
      console.log(params)
      getRequest = () => {
        if (Platform.OS != 'ios') {
          return pinch.fetch(baseUrl + url, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', },
            // headers: {
            //   'Content-Type': 'text/plain;charset=UTF-8',
            //   'Accept': 'application/json',
            //   'Connection': 'keep-alive'
            // },
            body: JSON.stringify(params),
            timeoutInterval: 20000,
          })
        } else {
          return axios(url, fetchParams)
        }
      }

      getRequest()
        .then((response) => {
          let data;
          console.log('got a responce')
          console.log(response)
          if (response.bodyString) {
            try {
              data = JSON.parse(response.bodyString)
            } catch (error) {
              console.log('error parse bodyString')
              console.log(error)
              resolve({
                msg: 'Error during the request',
              })
            }
          } else {
            data = response.data
          }
          if (response.status != 200) {
            resolve({
              msg: 'Error during the request',
            })
          } else {
            resolve(data)
          }
        })
        .catch((error) => {
          console.log('error response')
          console.log(error)
          // if (error.code == 'ECONNABORTED') {
          //   reject({
          //     code: 408,
          //     message: 'Timeout. Check your internet connection.',
          //   })
          // }
          resolve({
            code: 500,
            msg: 'Error during the request',
          })
        })
    })
  }
}