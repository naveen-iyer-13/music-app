
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
  AlertIOS,
  StatusBar
} from 'react-native'
import { getTrending } from './../../common/helpers'
import Footer from '../../common/Footer'
import { ListView } from '../../common/ListView'
import PopupModal from '../../common/PopupModal'
import SplashScreen from '../../common/SplashScreen'
import LinearGradient from 'react-native-linear-gradient';
import { removeFromLibrary, addToLibrary } from './../../common/helpers'

let defaultIcon = require('./../../images/default-icon.png')

class Trending extends Component {

  constructor(props) {
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

  getSongs() {
    this.setState({ loading: true })
    AsyncStorage.getItem('trendingSongs', (err, res) => {
      if (res)
        this.setState({ trendingSongs: JSON.parse(res), loading: false })
      else
        getTrending((trendingSongs) => {
          this.setState({ trendingSongs, loading: false })
        })
    })
  }

  randomNumber() {
    let randomArray = []
    while (randomArray.length < 10) {
      let num = Math.floor(Math.random() * 50)
      if (!randomArray.includes(num)) {
        randomArray.push(num)
      }
    }
    this.setState({ randomArray })
  }

  openModal(song) {
    this.setState({ popupModal: true, selectedSong: song })
  }

  closeModal = (action, data, operation) => {
    if (action === 'Search') {
      this.setState({ popupModal: false })
      this.navigateTo('Search', data)
    }
    else if (action === 'Library') {
      this.setState({ popupModal: false })
      if (operation === 'add') {
        AsyncStorage.getItem('library', (err, res) => {
          let library = res ? JSON.parse(res) : []
          let flag = false
          for (let i = 0; i < library.length; i++) {
            if (library[i].title === data.title) {
              flag = true
              break
            }
          }
          if (!flag) {
            library.push(data)
            AsyncStorage.setItem('library', JSON.stringify(library))
          }
          else {
            Alert.alert(
              'Song already exists',
            )
          }
        })
      }
      else {
        removeFromLibrary(data, res => { })
      }
    }
    else if (action === 'Playlists') {
      this.setState({ openPlaylist: true, songToBeAdded: data })
      AsyncStorage.getItem('playlists', (err, res) => {
        this.setState({ playlistName: res ? Object.keys(JSON.parse(res)) : [] })
      })
    }
    else if (action === 'Cancel Create') {
      this.setState({ openPlaylist: true, addPlaylistModal: false })
    }
    else if (action === 'Create') {
      AsyncStorage.getItem('playlists', (err, res) => {
        let playlists = res ? JSON.parse(res) : {}
        if (!Object.keys(playlists).includes(data)) {
          playlists[data] = []
          let { playlistName } = this.state
          playlistName.push(data)
          this.setState({ playlistName, addPlaylistModal: false })
          AsyncStorage.setItem('playlists', JSON.stringify(playlists))
        }
        else {
          Alert.alert(
            'Playlist already exists',
          )
        }
      })
      // console.log('creating palylist');
    }
    else {
      this.setState({ popupModal: false, openPlaylist: false })
    }
  }

  addToPlaylist = (playlistName) => {
    const { songToBeAdded } = this.state
    this.setState({ popupModal: false, openPlaylist: false })
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = res ? JSON.parse(res) : {}
      let flag = false
      for (let i = 0; i < playlists[playlistName].length; i++) {
        if (playlists[playlistName][i].title === songToBeAdded.title) {
          flag = true
          break
        }
      }
      if (!flag) {
        playlists[playlistName].push(songToBeAdded)
        AsyncStorage.setItem('playlists', JSON.stringify(playlists))
      }
      else {
        Alert.alert(
          'Song already exists',
        )
      }
    })
  }

  createPlaylist = () => {
    this.setState({ addPlaylistModal: true })
  }

  navigateTo = (screen, song) => {
    this.props.navigation.navigate(screen, { song })
  }

  playSong = (index) => {
    this.props.navigation.navigate('Player', { index, storageKey: 'trendingSongs' })
  }

  onError = (id) => {
    let { fetchFailed } = this.state
    fetchFailed.push(id)
    this.setState({ fetchFailed })
  }

  render() {
    var trending = this.state.trendingSongs
    // console.log('Trendin covers', trending);
    var List = <View />
    var artistView = <View />

    const getArtistName = (name) => {
      return name.length > 8 ? name.substring(0, 7).trim() + " ..." : name
    }

    var randomIndex = this.state.randomArray[0]
    if (trending.length > 0) {
      List = trending.map((item, index) => {
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
            key={item.title + index}
          />
        );
      })
      artistView = trending.map((item, index) => {
        // console.log("Cover", item.cover)
        if (this.state.randomArray.includes(index)) {
          return (
            <View key={index} style={styles.trendingView} >
              <TouchableOpacity style={{ height: 100, paddingLeft: 10, paddingTop: 10 }} onPress={() => this.props.navigation.navigate('Search', { song: item })}>
                <Image
                  style={styles.trendingImage}
                  source={item.cover ? { uri: item.cover } : defaultIcon}
                />
              </TouchableOpacity>
              <View style={{ height: 10, width: 100, backgroundColor: 'transparent' }}>
                <Text style={styles.trendingTitle}>{getArtistName(item.artist)}</Text>
              </View>
            </View>
          )
        }
      })
    }
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <SplashScreen />
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <ScrollView>
            <LinearGradient start={{ x: 0.0, y: 0.0 }} end={{ x: 0.9, y: 0.0 }} colors={['#7AFFA0', '#62D8FF']} style={{ height: 5, width: Dimensions.get('window').width }} />
            <View style={{ height: 190, width: Dimensions.get('window').width }}>
              <ImageBackground
                source={{ uri: this.state.trendingSongs[0].cover }}
                style={styles.backgroundImage}
                blurRadius={1}>
                <LinearGradient start={{ x: 0.0, y: 0.7 }} end={{ x: 0.0, y: 0.0 }} colors={['rgba(255, 255, 255, 1)', 'rgba(0,0,0, 0.4)']} >
                  <Text style={styles.trendingArtist}>TRENDING ARTIST</Text>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{ width: this.state.datesLength * 90 }} showsHorizontalScrollIndicator={false}>
                    {artistView}
                  </ScrollView>
                </LinearGradient>
              </ImageBackground>
            </View>
            <Text style={styles.heading}>TODAY{"'"}S TOP 100</Text>
            <ScrollView>
              {List}
            </ScrollView>
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
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);

export default Trending;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
    paddingTop: 20,
    fontFamily: Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    color: '#000000',
    fontSize: 20
  },
  trendingTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    color: '#797979',
    paddingTop: 10,
  },
  trendingImage: {
    resizeMode: 'contain',
    height: 80,
    width: 80,
    borderRadius: Platform.OS === 'android' ? 80 : 40
  },
  trendingView: {
    width: 100,
    height: 180,
  },
  backgroundImage: {
    width: '100%',
    height: 190,
  },
  trendingArtist: {
    fontFamily: Platform.OS === 'android' ? 'Proxima-Nova-Bold' : 'ProximaNova-Bold',
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingTop: 25
  }
});
