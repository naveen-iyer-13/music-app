import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  Text
} from 'react-native'
import { Search } from './../../common/Search'
import Footer from './../../common/Footer'
import { ListView } from './../../common/ListView'
import PopupModal from './../../common/PopupModal'
import { searchSong } from './../../common/helpers'

let { height, width } = Dimensions.get('window')


class SearchScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      list: [],
      searchTerm: '',
      popupModal: false,
      openPlaylist: false,
    }
  }

  componentWillMount() {
    const { params } = this.props.navigation.state
    if(params && params.song.artist){
      this.handleSearch(params.song.artist)
      this.setState({searchTerm: params.song.artist})
    }
  }

  handleSearch = (text) => {
    this.setState({searchTerm: text})
    searchSong(text, res => {
      if(res)
        this.setState({list: res})
      else
        this.setState({list: []})
    })
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
            'Song already exists',
          )
        }
      })
    }
    else if (action === 'Playlists') {
      this.setState({openPlaylist: true, songToBeAdded: data})
      AsyncStorage.getItem('playlists', (err, res) => {
        this.setState({playlistName: Object.keys(JSON.parse(res))})
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

  navigateTo = (screen, song) => {
      this.props.navigation.navigate(screen, {song})
    }

  playSong = (song) => {
    this.props.navigation.navigate('Player', {song})
  }

  render(){
    const { list, searchTerm, selectedSong, popupModal } = this.state
    return(
      <View style={styles.container}>
        <View style={{display: 'flex', alignItems: 'center', height: 50, justifyContent: 'center'}}>
          <Text style={{fontSize: 24}}>Search</Text>
        </View>
        <View style={styles.screenContainer}>
          <Search
            searchTerm={searchTerm}
            handleSearch={this.handleSearch}
          />
          <ScrollView>
            {
              list && list.length > 0 && list.map((song,index) => (
                <ListView
                  key={song.title + index}
                  thumbnail={song.thumbnail}
                  title={song.title}
                  song={song}
                  playSong={this.playSong}
                  openModal={this.openModal}
                />
              ))
            }
          </ScrollView>
        </View>
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
        <Footer screenName={'Search'} navigation={this.props.navigation}/>
      </View>
    )
  }
}

export default SearchScreen

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    backgroundColor: '#FFFFFF',
    width,
    height
  },
  screenContainer:{
    height: height - 140,
    paddingRight: 12,
    paddingLeft: 12
  },
})
