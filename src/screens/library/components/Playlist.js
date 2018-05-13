import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage
} from 'react-native'
import { ListView } from './../../../common/ListView'

class Playlists extends Component{
  constructor(props){
    super(props)
    this.state = {
      playlists: null,
      list: [],
      playlistOpen: false
    }
  }

  componentWillMount() {
    this.getData()
  }

  componentWillReceiveProps() {
    this.setState({playlistOpen: false})
  }

  getData = () => {
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = JSON.parse(res)
      if(playlists){
        this.setState({playlists})
      }
    })
  }

  openPlaylist = (list) => {
    console.log('here');
    this.setState({list, playlistOpen: true})
  }

  playSong = (song) => {
    // console.log(this.props);
    this.props.navigation.navigate('Player', {song})
  }

  render() {
    const { playlists, playlistOpen, list } = this.state
    console.log(this.state);
    return(
      <View>
        {
          !playlistOpen && playlists && Object.keys(playlists).map(key => (
            <View>
              {
                  <ListView thumbnail={''} title={key} len={playlists[key].length} song={playlists[key]} openPlaylist={this.openPlaylist}/>
              }
            </View>
          ))
        }
        {
          playlistOpen && list.map(song => (
            <ListView thumbnail={song.thumbnail} title={song.title} song={song.title} playSong={this.playSong}/>
          ))
        }
      </View>
    )
  }
}

export default Playlists
