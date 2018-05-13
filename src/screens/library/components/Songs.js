import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  ScrollView,
  Alert
} from 'react-native'
// import { getTrending } from './../../../common/helpers'
import { ListView } from './../../../common/ListView'
import PopupModal from './../../../common/PopupModal'
import { Search } from './../../../common/Search'


class Songs extends Component{
  constructor(props){
    super(props)
    this.state = {
      list:[],
      searchList: [],
      popupModal: false,
      searchTerm: '',
      openPlaylist: false,
    }
  }

  componentWillMount() {
    if(this.props.list)
      this.setState({list: this.props.list})
    else
      this.getSongs()
  }

  closeModal = (action, data) => {
    if(action === 'Search'){
      this.setState({popupModal: false})
      this.navigateTo('Search', data)
    }
    else if (action === 'Library') {
      this.setState({popupModal: false})
      AsyncStorage.getItem('library', (err, res) => {
        let library = res ? JSON.parse(res) : []
        let flag = false
        for(let i = 0; i < library.length; i++){
          if(library[i].title === data.title){
            flag = true
            break
          }
        }
        if(!flag){
          library.push(data)
          AsyncStorage.setItem('library', JSON.stringify(library))
        }
        else{
          Alert.alert(
          'Alert',
          'Song already exists'
          )
        }
      })
    }
    else if (action === 'Playlists') {
      this.setState({openPlaylist: true, songToBeAdded: data})
      AsyncStorage.getItem('playlists', (err, res) => {
        this.setState({playlistName: res ? Object.keys(JSON.parse(res)) : []})
      })
    }
    else if (action === 'Cancel Create') {
      this.setState({openPlaylist: true, addPlaylistModal: false})
    }
    else if(action === 'Create'){
      AsyncStorage.getItem('playlists', (err, res) => {
        let playlists = res ? JSON.parse(res) : {}
        if(!Object.keys(playlists).includes(data)){
          playlists[data] = []
          let { playlistName } = this.state
          playlistName.push(data)
          this.setState({playlistName, addPlaylistModal: false}, () => console.log(this.state))
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
    else{
      this.setState({popupModal: false, openPlaylist: false})
    }
  }

  addToPlaylist = (playlistName) => {
    const { songToBeAdded } = this.state
    this.setState({popupModal: false})
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = res ? JSON.parse(res) : {}
      let flag = false
      for(let i = 0; i < playlists[playlistName].length; i++){
        if(playlists[playlistName][i].title === songToBeAdded.title){
          flag = true
          break
        }
      }
      if(!flag){
        playlists[playlistName].push(songToBeAdded)
        AsyncStorage.setItem('playlists', JSON.stringify(playlists))
      }
      else{
        Alert.alert(
          'Song already exists',
        )
      }
    })
  }

  createPlaylist = () => {
    this.setState({addPlaylistModal: true})
  }

  openModal = (song) => {
    this.setState({popupModal: true, selectedSong: song})
  }

  getSongs(){
    this.setState({loading: true})
    AsyncStorage.getItem('library', (err, res) => {
      if(res)
        this.setState({list: JSON.parse(res), loading: false})
      this.setState({loading: false})
    })
  }

  navigateTo = (screen, song) => {
    this.props.navigation.navigate(screen, {song})
  }

  handleSearch = (text) => {
    let { list } = this.state
    this.setState({searchTerm: text})
    let searchList = list.filter(song => song.title.toLowerCase().includes(text.toLowerCase()))
    this.setState({searchList})
  }

  playSong = (song) => {
    // console.log(this.props);
    this.props.navigation.navigate('Player', {song})
  }

  render() {
    let { list, searchList, popupModal, selectedSong, searchTerm, loading } = this.state
    console.log(this.state);
    list = searchTerm? searchList : list
    return(
      <View>
        <Search
          searchTerm={searchTerm}
          handleSearch={this.handleSearch}
          clearText={() => this.setState({searchTerm: ''})}
        />
        {
            loading
             ?
            <Text>Loading</Text>
             :
            <ScrollView style={{ paddingTop: 20}}>
              {
                list.length > 0 ? list.map((song,index) => (
                  <ListView
                    key={song.title + index}
                    thumbnail={song.thumbnail}
                    title={song.title}
                    song={song}
                    openModal={this.openModal}
                    playSong={this.playSong}
                  />
                ))
                :
                <Text>You don't have songs in your library</Text>
              }
            </ScrollView>
        }
        <PopupModal
          active={popupModal}
          closeModal={this.closeModal}
          navigation={this.props.navigation}
          song={selectedSong}
          openPlaylist={this.state.openPlaylist}
          playlistName={this.state.playlistName}
          addToPlaylist={this.addToPlaylist}
          createPlaylist={this.createPlaylist}
          addPlaylistModal={this.state.addPlaylistModal}
        />
      </View>
    )
  }
}

export default Songs
