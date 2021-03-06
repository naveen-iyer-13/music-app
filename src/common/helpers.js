import { instance } from './../utils/config/ApiConf'
import {
  AsyncStorage,
  Alert,
  Platform,
  ToastAndroid,
  AlertIOS
} from 'react-native'
import axios from 'axios'

let CancelToken = axios.CancelToken;
let source = CancelToken.source();

export const getTrending = (cb) => {
  instance.get('/top100').then(res => {
    console.log('Response', res.data)
    AsyncStorage.setItem('trendingSongs', JSON.stringify(res.data))
    cb(res.data)
  })
  .catch(err => {
    console.log('Error', err)
    cb(false)
  })
}
let URLS = []
export const getStreamingUrl = (data, cb) => {
  fetchUrl(data, 0, cb)
}

const fetchUrl = (data, index, cb) => {
  data = [...data]
  let obj = {...data[index]}
  if(index < data.length){
    instance.get(`/stream/${data[index].bp_id}`).then(res => {
      console.log(res, 'res')
      if (res.data.streamlink)
        obj.url = res.data.streamlink
      else
        obj.url = 'processing'
      data[index] = {...data[index]}
      data[index] = obj
        if(index === data.length - 1){
        cb(data)
      }
      fetchUrl(data, index+1, cb)
    }).catch(err => {
      console.log(err, 'error')
      obj.url = 'processing'
      data[index] = {...data[index]}
      data[index] = {...obj}
      if(index === data.length - 1){
        cb(data)
      }
      fetchUrl(data, index+1, cb)
    })
  }
}

export const removeFromPlaylist = async(name, song, cb) => {
    AsyncStorage.getItem('playlists', async(err, res) => {
      if (res) {
        let playlistList = JSON.parse(res)
        let list = playlistList[name]
        let track = list.filter(obj => obj.bp_id === song.bp_id)
        let index = -1
        for(let i=0;i<list.length;i++) {
          if (track && track[0] && (track[0].bp_id === list[i].bp_id)) {
            index = i
            break;
          }
        }
        if (index === -1) {
          if(Platform.OS === 'android'){
            ToastAndroid.show('Song doesn\'t exist in the playlist', ToastAndroid.SHORT)
          }
          else{
            AlertIOS.alert('Song doesn\'t exist in the playlist')
          }
          cb(true)
        }
        else {
          list.splice(index, 1)
          playlistList[name] = list
          // console.log(playlistList)
          if(Platform.OS === 'android')
            ToastAndroid.show('Song has been removed from playist', ToastAndroid.SHORT)
          else{
            AlertIOS.alert('Song has been removed from playist')
          }
          await AsyncStorage.setItem('playlists', JSON.stringify(playlistList))
          cb(true)
        }
      }
    })
}

export const addToLibrary = async(list, song,  cb) => {
  let track = list.filter(obj => obj.bp_id === song.bp_id )
  let tracks = []
    AsyncStorage.getItem('library', (err, res) => {
      if (res) {
        tracks = JSON.parse(res)
      }

      let t = tracks.filter(obj => obj && (obj.bp_id === track[0].bp_id))

      if (t.length > 0) {
        if(Platform.OS === 'android')
          ToastAndroid.show('Song already exists in library', ToastAndroid.SHORT)
        else{
          AlertIOS.alert('Song already exists in library')
        }
        cb(false)

      }
      else {
        tracks.unshift(track[0])
        AsyncStorage.setItem('library', JSON.stringify(tracks))
        if(Platform.OS === 'android')
          ToastAndroid.show('Song has been added to library', ToastAndroid.SHORT)
        else{
          AlertIOS.alert('Song has been added to library')
        }
        cb(true)

      }

    })

}

export const removeFromLibrary = async(song , cb) => {
  AsyncStorage.getItem('library', (err, res) => {
    if (res) {
      tracks = JSON.parse(res)
      let newTracks = tracks.filter(obj => obj.bp_id !== song.bp_id)
      if (tracks.length === newTracks.length) {
        if(Platform.OS === 'android')
          ToastAndroid.show('Song doesn\'t exist in library', ToastAndroid.SHORT)
        else{
          AlertIOS.alert('Song doesn\'t exist in library')
        }
        cb(false)

      }
      else {
        AsyncStorage.setItem('library', JSON.stringify(newTracks))
        if(Platform.OS === 'android')
          ToastAndroid.show('Song has been removed from library', ToastAndroid.SHORT)
        cb(newTracks)
      }


    }
    else {
      if(Platform.OS === 'android')
        ToastAndroid.show('Error occurred', ToastAndroid.SHORT)
      else{
        AlertIOS.alert('Error occurred')
      }
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
    console.log(res);
    cb(res.data)
  })
  .catch(err => {
    cb(false)
  })
}

export const ifInLibrary = async(track, cb) => {
  AsyncStorage.getItem('library', (err, res) => {
    if (res) {
      let target = JSON.parse(res).filter((obj, i) => obj && (obj.bp_id === track.bp_id))

       cb(true)
      }
      else
        cb(false)
    
  })

}

export const ifInPlaylists = async(track, name) => {
  AsyncStorage.getItem('playlists', (err, res) => {
    if (res) {
      let target = JSON.parse(res)[name] ? JSON.parse(res)[name].filter((obj, i) => obj && (obj.bp_id === track.bp_id)) : null
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
