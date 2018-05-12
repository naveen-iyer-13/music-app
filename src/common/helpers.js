import { instance } from './../utils/config/ApiConf'

export const getTrending = (cb) => {
  instance.get('/top100').then(res => (
    cb(res.data)
  ))
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
