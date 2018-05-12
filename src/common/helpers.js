import { instance } from './../utils/config/ApiConf'
import {
  AsyncStorage
} from 'react-native'

export const getTrending = (cb) => {
  // console.log('getTrending');
  instance.get('/top100').then(res => {
    AsyncStorage.setItem('trendingSongs', JSON.stringify(res.data))
    cb(res.data)
  })
  .catch(err => {
    cb(false)
  })
}

export const searchSong = (q, cb) => {
  instance.get(`/search/${q}`).then(res => {
    cb(res.data)
  })
  .catch(err => {
    cb(false)
  })
}
