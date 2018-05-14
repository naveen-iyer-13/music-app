import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
  AlertIOS
} from 'react-native'
import { getTrending } from './../../common/helpers'
import Footer from '../../common/Footer'
import {ListView} from '../../common/ListView'
import PopupModal from '../../common/PopupModal'
import SplashScreen from '../../common/SplashScreen'

let defaultIcon = require('./../../images/default-icon.png')

class Trending extends Component {

  constructor (props) {
    super(props);
    this.state = {
      trendingSongs: [],
      randomArray: [],
      loading: true,
      popupModal: false,
      openPlaylist: false,
      fetchFailed: []
    }
  }

  componentDidMount() {
    this.getSongs()
    this.randomNumber()
  }

  getSongs(){
    this.setState({loading: true})
    AsyncStorage.getItem('trendingSongs', (err, res) => {
      if(res)
        this.setState({trendingSongs: JSON.parse(res), loading: false})
      else
        getTrending((trendingSongs) => {
          this.setState({trendingSongs, loading: false})
        })
    })
  }

  randomNumber(){
    var random;
    var array = []
    for(var i = 0 ; i < 10 ; i++){
      random = Math.floor(Math.random()*101);
      array.push(random)
    }
    var sortedArray = array.sort();
    this.setState({randomArray: sortedArray})
  }

  openModal(song){
    this.setState({popupModal: true, selectedSong: song})
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
          this.setState({playlistName, addPlaylistModal: false})
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

  navigateTo = (screen, song) => {
    this.props.navigation.navigate(screen, {song})
  }

  playSong = (song, index) => {
    this.props.navigation.navigate('Player', {index, storageKey:'trendingSongs'})
  }

  onError = (id) => {
    let { fetchFailed } = this.state
    fetchFailed.push(id)
    this.setState({fetchFailed})
  }

  render () {
    var trending = this.state.trendingSongs
    var List = <View />
    var artistView = <View />

    var randomIndex = this.state.randomArray[0]
    if(trending.length > 0){
      List = trending.map((item, index)=> {
        return (
           <ListView
             title={item.title}
             artist={item.artist}
             thumbnail={item.thumbnail}
             song={item}
             openModal={this.openModal.bind(this)}
             playSong={this.playSong}
             index={index}
             onError={this.onError}
             fetchFailed={this.state.fetchFailed}
             key={item.title+index}
          />
        );
      })
       artistView= trending.map((item, index)=> {
        if(this.state.randomArray.includes(index)){
          return(
            <TouchableOpacity key={index} style={styles.trendingView} onPress={() => this.props.navigation.navigate('Search', {song: item})}>
              <Image
                style={styles.trendingImage}
                source={item.cover ? {uri: item.cover} : defaultIcon}
              />
              <Text style={styles.trendingTitle}>{item.artist}</Text>
            </TouchableOpacity>
          )
        }
      })
    }
    if(this.state.loading){
      return (
        <SplashScreen />
      )
    }
    else {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={{uri: trending[randomIndex].cover}}
            style={styles.backgroundImage}
          >
         <View style={styles.topView}>
          <Text style={styles.trendingArtist}>Trending artist</Text>
           <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{width: this.state.datesLength*90}} showsHorizontalScrollIndicator={false}>
            {artistView}
           </ScrollView>
         </View>
         </ImageBackground>
         <Text style={styles.heading}>TODAY{"'"}S TOP 100 SONGS</Text>
         <ScrollView>
          {List}
         </ScrollView>
         <Footer screenName={'Trending'} navigation={this.props.navigation} />
         <PopupModal
           active={this.state.popupModal}
           closeModal={this.closeModal}
           navigation={this.props.navigation}
           song={this.state.selectedSong}
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
}

export default Trending;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topView: {
    height: 175,
    borderTopWidth: 4,
    borderBottomWidth: 1
  },
  heading: {
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A',
    fontSize: 14
  },
  trendingTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily :'Proxima-Nova-Bold',
    color: '#797979',
    paddingTop: 5
  },
  trendingImage: {
    resizeMode: 'contain',
    height: 80,
    width: 80,
    borderRadius: 80
  },
  trendingView: {
    paddingLeft: 15,
    paddingTop: 15,
    width: 100
  },
  backgroundImage: {
    width: '100%',
    height: 180
  },
  topView:{
    height: 180,
    alignItems: 'center'
  },
  trendingArtist: {
    fontFamily: 'Proxima-Nova-Bold',
    color: '#fff',
    fontSize: 22,
    paddingTop: 15,
  }
});
