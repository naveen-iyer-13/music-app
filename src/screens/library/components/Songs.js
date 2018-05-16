import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  ScrollView,
  Alert,
  Dimensions,
  Image
} from 'react-native'
// import { getTrending } from './../../../common/helpers'
import { ListView } from './../../../common/ListView'
import PopupModal from './../../../common/PopupModal'
import { Search } from './../../../common/Search'
import { removeFromLibrary } from './../../../common/helpers'

let {height, width} = Dimensions.get('window')

class Songs extends Component{
  constructor(props){
    super(props)
    this.state = {
      list:[],
      searchList: [],
      popupModal: false,
      searchTerm: '',
      openPlaylist: false,
      fetchFailed: []
    }
  }

  componentWillMount() {
    if(this.props.list)
      this.setState({list: this.props.list})
    else
      this.getSongs()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({list: nextProps.list})
  }

  closeModal = (action, data, operation) => {
    // console.log(action, operation);
    if(action === 'Search'){
      this.setState({popupModal: false})
      this.navigateTo('Search', data)
    }
    else if (action === 'Library') {
      this.setState({popupModal: false})
      if(operation === 'add'){
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
      else{
        removeFromLibrary(data, res => {})
      }
    }
    else if (action === 'Playlists') {
      this.setState({openPlaylist: !this.props.isPlaylistPage, songToBeAdded: data})
      if(operation === 'add'){
        AsyncStorage.getItem('playlists', (err, res) => {
          this.setState({playlistName: res ? Object.keys(JSON.parse(res)) : []})
        })
      }
      else{
        AsyncStorage.getItem('playlists', (err, res) => {
          let playlists = res ? JSON.parse(res) : {}
          playlists[this.props.selectedPlaylist] = playlists[this.props.selectedPlaylist].filter(item => data.title !== item.title)
          AsyncStorage.setItem('playlists', JSON.stringify(playlists), () => this.props.updatePlaylist(playlists))
        })
      }
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
          this.setState({playlistName, addPlaylistModal: false})
          AsyncStorage.setItem('playlists', JSON.stringify(playlists))
        }
        else{
          Alert.alert(
            'Playlist already exists',
          )
        }
      })
      // console.log('creating palylist');
    }
    else{
      this.setState({popupModal: false, openPlaylist: false})
    }
  }

  addToPlaylist = (playlistName, operation) => {
    const { songToBeAdded } = this.state
    this.setState({popupModal: false, openPlaylist: false})
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
    let searchList = list.filter(song => song && (song.title && song.title.toLowerCase().includes(text.toLowerCase())) || (song.artist && song.artist.toLowerCase().includes(text.toLowerCase())))
    this.setState({searchList})
  }

  playSong = (index, title) => {
    // console.log(this.props);
    let { storageKey, selectedPlaylist } = this.props
    if (storageKey)
      this.props.navigation.navigate('Player', {index, storageKey: 'playlists', name: selectedPlaylist})
    else
      this.props.navigation.navigate('Player', {index, storageKey: 'library'})

  }

  onError = (id) => {
    let { fetchFailed } = this.state
    fetchFailed.push(id)
    this.setState({fetchFailed})
  }

  render() {
    let { list, searchList, popupModal, selectedSong, searchTerm, loading } = this.state
    // console.log(this.state);
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
            <ScrollView style={{ paddingTop: 20, paddingBottom:20}}>
              {
                list && list.length > 0 ? list.map((song,index) => (
                  <ListView
                    key={song.title + index}
                    thumbnail={song.thumbnail}
                    title={song.title}
                    artist={song.artist}
                    song={song}
                    index={index}
                    openModal={this.openModal}
                    playSong={this.playSong}
                    onError={this.onError}
                    fetchFailed={this.state.fetchFailed}
                  />
                ))
                :
                <View style={{ display: 'flex',height: (height * 50)/100, alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('./../../../images/broken-heart.png')} style={{width: 50, height: 50}}/>
                  <Text style={{ width: 150,fontSize: 18, color: '#252525', opacity: 0.4, fontFamily: 'Proxima-Nova-Bold', textAlign: 'center'}}>
                    You don't have songs in your {this.props.isPlaylistPage ? 'playlist' : 'library'}!
                  </Text>
                </View>
              }
            </ScrollView>
        }
        <PopupModal
          active={popupModal}
          closeModal={this.closeModal}
          navigation={this.props.navigation}
          song={selectedSong}
          isPlaylistPage={this.props.isPlaylistPage}
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
