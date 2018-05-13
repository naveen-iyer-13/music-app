import { instance } from './../utils/config/ApiConf'
import {
  AsyncStorage,
  Alert
} from 'react-native'
import axios from 'axios'

let CancelToken = axios.CancelToken;
let source = CancelToken.source();

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

export const removeFromPlaylist = async(name, song, cb) => {
    AsyncStorage.getItem('playlists', (err, res) => {
      if (res) {
        let playlist = JSON.parse(res)[name]
      let track = playlist.filter(obj => obj.bp_id === song.id)
      let index = 0
      for(let i=0;i<playlist.length;i++) {
        if (track === playlist[i]) {
          index = i
          break;
        }
      }
      playlist.splice(index, 1)
      AsyncStorage.setItem('playlists', playlist)
      Alert.alert(
      'Success',
      'Song has been removed from the playlist '+name,
      [
        {text: 'OK', onPress: () =>  cb(true)}
      ],
      { cancelable: false }
    )
      }
      
    })
      

}

export const searchSong = (q, cb) => {
  if(source)
    source.cancel()
  CancelToken = axios.CancelToken;
  source = CancelToken.source();

  instance.get(`/search/${q}`,{
    cancelToken: source.token
  }).then(res => {
    cb(res.data)
  })
  .catch(err => {
    cb(false)
  })
}

// export const closeApp = () =>{
//   AsyncStorage.removeItem('mountInfo')
// }
