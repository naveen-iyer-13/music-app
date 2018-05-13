import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  Text,
  Image
} from 'react-native'
import { Search } from './../../common/Search'
import Footer from './../../common/Footer'
import { ListView } from './../../common/ListView'
import PopupModal from './../../common/PopupModal'
import { searchSong } from './../../common/helpers'
import {
  BarIndicator,
} from 'react-native-indicators';
let { height, width } = Dimensions.get('window')


class SearchScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      list: [],
      searchTerm: '',
      popupModal: false,
      openPlaylist: false,
      loading: false
    }
  }

  componentWillMount() {
    const { params } = this.props.navigation.state
    // console.log(this.props);
    if(params && params.song.artist){
      this.handleSearch(params.song.artist)
      this.setState({searchTerm: params.song.artist})
    }
  }

  handleSearch = (text) => {
    this.setState({searchTerm: text, loading: true})
    searchSong(text, res => {
      if(res)
        this.setState({list: res, loading: false})
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
    const { list, searchTerm, selectedSong, popupModal, loading } = this.state
    console.log(this.state);
    return(
      <View style={styles.container}>
        <View style={{display: 'flex', alignItems: 'center', height: 50, justifyContent: 'center'}}>
          <Text style={{fontSize: 18, fontFamily: 'Proxima-Nova-Bold', color: '#000'}}>Search</Text>
        </View>
        <View style={styles.screenContainer}>
          <Search
            searchTerm={searchTerm}
            handleSearch={this.handleSearch}
            clearText={() => this.setState({searchTerm: ''})}
          />
          {
            searchTerm
            ?
            <ScrollView>
              {
                loading
                ?
                <ScrollView>
                 <View style={{height: Dimensions.get('window').height-170, justifyContent:'center', alignItems: 'center'}}>
                  <BarIndicator color='#6DEAD3' count = {5}/>
                 </View>
                </ScrollView>
                :
                list && list.length > 0
                ?
                list.map((song,index) => (
                  <ListView
                    key={song.title + index}
                    thumbnail={song.thumbnail}
                    title={song.title}
                    song={song}
                    playSong={this.playSong}
                    openModal={this.openModal}
                  />
                ))
                :
                <ScrollView>
                 <View style={{height: Dimensions.get('window').height-170, justifyContent:'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 18, color: '#252525', opacity: 0.4, fontFamily: 'Proxima-Nova-Bold', marginTop: 20, width: 150, textAlign: 'center'}}>No results found</Text>
                 </View>
                </ScrollView>
              }
            </ScrollView>
            :
            <ScrollView>
             <View style={{height: Dimensions.get('window').height-170, justifyContent:'center', alignItems: 'center'}}>
              <Image source={require('./../../images/search.png')} style={{width: 30, height: 30, resizeMode: 'contain'}}/>
              <Text style={{fontSize: 18, color: '#252525', opacity: 0.4, fontFamily: 'Proxima-Nova-Bold', marginTop: 20, width: 150, textAlign: 'center'}}>Search for any song or artist</Text>
             </View>
            </ScrollView>
          }
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
    height: height - 125,
    paddingRight: 12,
    paddingLeft: 12
  },
})
