import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage
} from 'react-native'
import { ListView } from './../../../common/ListView'
import Songs from './Songs'
import RemovePlaylist from './RemovePlaylist'
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
    else if (action === 'Remove') {
      AsyncStorage.getItem('playlists', (err, res) => {
        res = JSON.parse(res)
        delete res[this.state.selectedPlaylist]
        AsyncStorage.setItem('playlists', JSON.stringify(res), (err) => {
          this.setState({openCreatePlaylistModal: false, playlistOpen: false, playlists: res})
        })
      })
    }
    else{
      this.props.handleModalClose()
    }
  }

  openPlaylist = (list, title) => {
    console.log(list);
    this.setState({list, playlistOpen: true, selectedPlaylist: title})
    this.props.handlePlaylistOpen(list, title)
  }

  playSong = (song, index, title) => {
    // console.log(this.props);
    this.props.navigation.navigate('Player', {index, storageKey: 'playlists', name: title})
  }

  render() {
    const { playlists, playlistOpen, searchList, list, loading } = this.state
    console.log(this.state);
    return(
      <View>
        {
          loading
          ?
          <Text>Loading</Text>
          :
          !playlistOpen
          ?
          playlists
          ?
          Object.keys(playlists).map((key, index) => (
            <View>
              {
                  <ListView
                    thumbnail={playlists[key][0] ? playlists[key][0].thumbnail : '' }
                    title={key}
                    key={index+key}
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
          playlistOpen && <Songs list={list} navigation={this.props.navigation} isPlaylistPage={true}/>
        }
        <PopupModal
          active={this.state.openCreatePlaylistModal && !playlistOpen}
          closeModal={this.closeModal}
          navigation={this.props.navigation}
          addPlaylistModal={this.state.openCreatePlaylistModal}
          onlyModal={true}
        />
        <RemovePlaylist active={playlistOpen && this.state.openCreatePlaylistModal} closeModal={this.closeModal}/>
      </View>
    )
  }
}

export default Playlists
