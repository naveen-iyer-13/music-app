import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage
} from 'react-native'
import { ListView } from './../../../common/ListView'
import Songs from './Songs'
import PopupModal from './../../../common/PopupModal'


class Playlists extends Component{
  constructor(props){
    super(props)
    this.state = {
      playlists: null,
      list: [],
      playlistOpen: false,
      searchList: ''
    }
  }

  componentWillMount() {
      this.getData()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.closePlaylist){
      this.setState({playlistOpen: false})
      this.props.reset()
    }
    this.setState({openCreatePlaylistModal: nextProps.openCreatePlaylistModal})
  }

  getData = () => {
    this.setState({loading: true})
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = JSON.parse(res)
      if(playlists){
        this.setState({playlists, loading: false})
      }
      else{
        this.setState({loading: false})
      }
    })
  }

  closeModal = (action, data) => {
    if (action === 'Cancel Create') {
      this.props.handleModalClose()
    }
    else if(action === 'Create'){
      AsyncStorage.getItem('playlists', (err, res) => {
        let playlists = res ? JSON.parse(res) : {}
        if(!Object.keys(playlists).includes(data)){
          playlists[data] = []
          this.setState({playlists}, () => this.props.handleModalClose())
          AsyncStorage.setItem('playlists', JSON.stringify(playlists))
        }
        else{
          Alert.alert(
            'Playlist already exists',
          )
        }
      })
      console.log('creating palylist');
    }
  }

  openPlaylist = (list, title) => {
    this.setState({list, playlistOpen: true})
    this.props.handlePlaylistOpen(list, title)
  }

  playSong = (song) => {
    // console.log(this.props);
    this.props.navigation.navigate('Player', {song})
  }

  render() {
    const { playlists, playlistOpen, searchList, list, loading } = this.state
    // console.log(this.state);
    return(
      <View>
        {
          loading
          ?
          <Text>Loading</Text>
          :
          !playlistOpen ?
          playlists
          ?
          Object.keys(playlists).map(key => (
            <View>
              {
                  <ListView
                    thumbnail={playlists[key][0] ? playlists[key][0].thumbnail : '' }
                    title={key}
                    len={playlists[key].length}
                    song={playlists[key]}
                    openPlaylist={this.openPlaylist}
                  />
              }
            </View>
          ))
          :
          <Text>You don't have any playlist in your library</Text>
          :
          <View/>
        }
        {
          playlistOpen && <Songs list={list} navigation={this.props.navigation} />
        }
        <PopupModal
          active={this.state.openCreatePlaylistModal}
          closeModal={this.closeModal}
          navigation={this.props.navigation}
          addPlaylistModal={this.state.openCreatePlaylistModal}
          onlyModal={true}
        />
      </View>
    )
  }
}

export default Playlists
