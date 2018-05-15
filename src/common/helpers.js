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
      let track = playlist.filter(obj => obj.bp_id === song.bp_id)
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


export const addToLibrary = async(list, song,  cb) => {
  let track = list.filter(obj => obj.bp_id === song.bp_id )
  let tracks = []
    AsyncStorage.getItem('library', (err, res) => {
        tracks = JSON.parse(res)
        tracks = [...tracks]
        let t = tracks.filter(obj => obj.bp_id === track[0].bp_id)
        if (t.length > 0) {
          Alert.alert(
            'Alert',
            'Song already exists in the library',
            [
              {text: 'OK', onPress: () =>  cb(false)}
            ],
            { cancelable: false }
          )
        }
        else {
          tracks.unshift(track[0])
          AsyncStorage.setItem('library', JSON.stringify(tracks)) 
          Alert.alert(
            'Success',
            'Song has been added to the library',
            [
              {text: 'OK', onPress: () =>  cb(true)}
            ],
            { cancelable: false }
          )
        }
       
      
    })
  
}

export const removeFromLibrary = async(song , cb) => {
  AsyncStorage.getItem('library', (err, res) => {
    if (res) {
      tracks = JSON.parse(res)
      let newTracks = tracks.filter(obj => obj.bp_id !== song.bp_id)
      if (tracks.length === newTracks.length) {
        Alert.alert(
          'Error',
          'Song is not present in the library',
          [
            {text: 'OK', onPress: () =>  cb(true)}
          ],
          { cancelable: false }
        )
      }
      else {
        AsyncStorage.setItem('library', JSON.stringify(newTracks)) 
        Alert.alert(
          'Success',
          'Song has been removed from the library',
          [
            {text: 'OK', onPress: () =>  cb(true)}
          ],
          { cancelable: false }
        )
      }
      
         
    }
    else {
      Alert.alert(
          'Sorry',
          'Library is not initialized',
          [
            {text: 'OK', onPress: () =>  cb(false)}
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

export const ifInLibrary = async(id, cb) => {
  AsyncStorage.getItem('library', (err, res) => {
    if (res) {
      let target = JSON.parse(res).filter((obj, i) => i === parseInt(id))
      if (target && target[0]) 
       cb(true)
      else 
        cb(false)
    }
  })
  
}

export const ifInPlaylists = async(id, name) => {
  AsyncStorage.getItem('playlists', (err, res) => {
    if (res) {
      let target = JSON.parse(res)[name].filter((obj, i) => i === parseInt(id))
      if (target && target[0]) 
        return true 
      else 
        return false
    }
  })
}


// export const closeApp = () =>{
//   AsyncStorage.removeItem('mountInfo')
// }
