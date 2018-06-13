import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  Text,
  Image,
  Platform
} from 'react-native'
import { Search } from './../../common/Search'
import Footer from './../../common/Footer'
import { ListView } from './../../common/ListView'
import PopupModal from './../../common/PopupModal'
import { searchSong } from './../../common/helpers'
import {
  BarIndicator,
} from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';
let { height, width } = Dimensions.get('window')


class SearchScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      list: [],
      searchTerm: '',
      popupModal: false,
      openPlaylist: false,
      loading: false,
      fetchFailed: []
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
        this.setState({popupModal: false})
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

  playSong = (index, name) => {
    this.props.navigation.navigate('Player', {index, search: this.state.list})
  }

  onError = (id) => {
    let { fetchFailed } = this.state
    fetchFailed.push(id)
    this.setState({fetchFailed})
  }

  render(){
    const { list, searchTerm, selectedSong, popupModal, loading } = this.state
    console.log(this.state);
    return(
      <View style={styles.container}>
        <LinearGradient
          colors={['#7AFFA0', '#62D8FF']}
          style={{height: Platform.OS === 'android' ? 10 : 20, width: Dimensions.get('window').width}}
          start={{x: 0.0, y: 0.5}} end={{x: 0.5, y: 1.0}}
        />
       <View style={{display: 'flex', alignItems: 'center', height: 50, justifyContent: 'center'}}>
          <Text style={{fontSize: 16, color: '#4A4A4A', fontFamily: Platform.OS === 'android' ? 'Proxima-Nova-Bold' : 'ProximaNova-Bold'}}>SEARCH</Text>
        </View>
        <View style={styles.screenContainer}>
          <View>
          <Search
            searchTerm={searchTerm}
            handleSearch={this.handleSearch}
            clearText={() => this.setState({searchTerm: ''})}
          />
          </View>
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
                    artist={song.artist}
                    index={index}
                    song={song}
                    playSong={this.playSong}
                    openModal={this.openModal}
                    onError={this.onError}
                    fetchFailed={this.state.fetchFailed}
                  />
                ))
                :
                <ScrollView>
                 <View style={{height: Dimensions.get('window').height-170, justifyContent:'center', alignItems: 'center'}}>
                   <Image source={require('./../../images/surprised.png')} style={{width: 50, height: 50}}/>
                   <Text style={{fontSize: 18, color: '#252525', opacity: 0.4, marginTop: 10, width: 200, textAlign: 'center', fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",}}>No search results!</Text>
                 </View>
                </ScrollView>
              }
            </ScrollView>
            :
            <ScrollView>
             <View style={{height: Dimensions.get('window').height-170, justifyContent:'center', alignItems: 'center'}}>
              <Image source={require('./../../images/search.png')} style={{width: 30, height: 30, resizeMode: 'contain'}}/>
              <Text style={{fontSize: 18, color: '#252525', opacity: 0.4, marginTop: 20, width: 150, textAlign: 'center', fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",}}>Search for any song or artist</Text>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  screenContainer:{
    height: Platform.OS === 'android' ? height - 135 : height - 120,
  },
})
