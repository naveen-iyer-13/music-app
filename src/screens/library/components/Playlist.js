import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  Dimensions,
  Image,
} from 'react-native'
import { ListView } from './../../../common/ListView'
import Songs from './Songs'
import RemovePlaylist from './RemovePlaylist'
import PopupModal from './../../../common/PopupModal'

let { height, width } = Dimensions.get('window')

class Playlists extends Component{
  constructor(props){
    super(props)
    this.state = {
      playlists: null,
      list: [],
      playlistOpen: false,
      searchList: '',
      fetchFailed: []
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

  // playSong = (index, title) => {
  //   // console.log(this.props);
  //   this.props.navigation.navigate('Player', {index, storageKey: 'playlists', name: title})
  // }

  onError = (id) => {
    // let { fetchFailed } = this.state
    // fetchFailed.push(id)
    // this.setState({fetchFailed})
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
          playlists && Object.keys(playlists).length
          ?
          Object.keys(playlists).map((key, index) => (
            <View>
              {
                  <ListView
                    thumbnail={playlists[key][0] ? playlists[key][0].thumbnail : '' }
                    showDefault={!playlists[key][0]}
                    title={key}
                    key={index+key}
                    len={playlists[key].length}
                    song={playlists[key]}
                    openPlaylist={this.openPlaylist}
                    index={index}
                    fetchFailed={[]}
                    onError={() => {}}
                  />
              }
            </View>
          ))
          :
          <View style={{ display: 'flex',height: (height * 50)/100, alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('./../../../images/broken-heart.png')} style={{width: 50, height: 50}}/>
                  <Text style={{ width: 150,fontSize: 18, color: '#252525', opacity: 0.4, fontFamily: 'Proxima-Nova-Bold', textAlign: 'center'}}>
                    You don't have any playlist in your library!
                  </Text>
                </View>
          :
          <View/>
        }
        {
          playlistOpen && <Songs storageKey={'playlists'} list={list} navigation={this.props.navigation} isPlaylistPage={true} selectedPlaylist={this.state.selectedPlaylist}/>
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
