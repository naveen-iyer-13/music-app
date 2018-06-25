import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ViewPropTypes,
  Dimensions,
  AsyncStorage,
  Modal,
  ToastAndroid,
  AlertIOS
} from 'react-native';
import PlayerModal from '../../../common/PlayerModal'
import QueueList from './QueueList'
import { addToLibrary, ifInLibrary, removeFromLibrary, ifInPlaylists } from '../../../common/helpers'
import {
  BarIndicator,
} from 'react-native-indicators';

class ProgressBar extends ProgressComponent {
  render() {
    return (
      <View style={styles.progress}>
        <View style={{ flex: this.getProgress(), backgroundColor: '#6DE9D6' }} />
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#6DE9D6', marginTop: -6 }} />
        <View style={{ flex: 1 - this.getProgress(), backgroundColor: 'white' }} />
      </View>
    );
  }
}

class Duration extends ProgressComponent {

  constructor(props) {
    super(props)
    this.state = {
      currentSecond: 0
    }
  }

  componentDidMount() {
    setInterval(() => {
      if (this.getProgress() > 0 && this.props.playbackState !== TrackPlayer.STATE_PAUSED)
        this.setState({
          currentSecond: 0
        })
      else if (this.getProgress() === 0)
        this.setState({
          currentSecond: 0
        })
    }, 1000)
  }

  render() {
    let duration = this.getDuration()
    let secDur = Math.floor(duration % 60)
    let minDur = Math.floor(duration / 60)
    const { currentSecond } = this.state
    let secCur = Math.floor(currentSecond % 60)
    let minCur = Math.floor(currentSecond / 60)
    secCur = secCur < 10 ? `0${secCur}` : secCur
    secDur = secDur < 10 ? `0${secDur}` : secDur
    return (
      <View >
        {
          duration > 0
            ?
            <View style={styles.timeSecton}>
              <View style={styles.leftTime}>
                <Text style={styles.time}>{minCur}:{secCur}</Text>
              </View>
              <View style={styles.rightTime}>
                <Text style={styles.time}>{minDur}:{secDur}</Text>
              </View>
            </View>
            :
            <View style={styles.timeSecton}>
            </View>
        }
      </View>
    );
  }
}

function ControlButton({ type, onPress }) {

  let buttonTypePath = require('../../../images/back.png')
  if (type === 'play')
    buttonTypePath = require('../../../images/play.png')
  else if (type === 'pause')
    buttonTypePath = require('../../../images/pause.png')
  else if (type === 'skip')
    buttonTypePath = require('../../../images/skip.png')
  else if (type === 'load')
    buttonTypePath = require('../../../images/playing.png')


  return (
    <View style={styles.controlButtonContainer}>
      {
        type === 'load'
          ?
          <View style={styles.loaderCircle} onPress={onPress}>
            <BarIndicator color='#D8D8D8' count={4} size={20} />
          </View>

          :
          <TouchableOpacity onPress={onPress}>
            <Image
              source={buttonTypePath}
              style={type !== 'back' && type !== 'skip' ? styles.playButton : styles.skipTrack}
            />
          </TouchableOpacity>
      }
    </View>


  );
}

ControlButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default class PlayerControll extends Component {

  constructor(props) {
    super(props)
    this.state = {
      popupModal: false,
      showPlaylists: false,
      playlistNames: [],
      showQueue: false,
      library: false,
      addPlaylistModal: false
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('playlists', (err, res) => {
      if (res) {
        this.setState({
          playlistNames: Object.keys(JSON.parse(res))
        })
      }
    })
    //
  }

  componentWillReceiveProps(nextProps) {
    this.initializeLibrary(nextProps.track)
    this.initializePlaylists(nextProps.track)

  }

  initializeLibrary = async(id) => {
    ifInLibrary(id, (value) => {
      this.setState({
        library: value
      })
    })

  }

  initializePlaylists = async(id) => {
    ifInPlaylists(id, (value) => {
      this.setState({
        library: value
      })
    })
  }

  static propTypes = {
    style: ViewPropTypes.style,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onTogglePlayback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {}
  };

  toggleModal = (libraryState) => {
    let { popupModal, library } = this.state
    this.setState({
      popupModal: !popupModal,
      showPlaylists: false,
      library: (typeof libraryState === 'boolean') ? (!library) : library,
      addPlaylistModal: libraryState === 'addPlaylist' ? false : true,
      addPlaylistModal: false
    })
  }

  navigateToScreen = (screen) => {
    this.setState({
      popupModal: false
    }, () => this.props.navigation.navigate(screen))

  }

  addToPlaylist = (playlistName) => {

    const { track, songs } = this.props
    let target = songs.filter(obj => obj.bp_id === track.bp_id)
    target = target[0]
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = res ? JSON.parse(res) : {}
      let flag = false
      for(let i = 0; i < playlists[playlistName].length; i++){
        if(playlists[playlistName][i] && (playlists[playlistName][i].title === target.title)){
          flag = true
          break
        }
      }
      if(!flag){
        playlists[playlistName].push(target)
        if(Platform.OS === 'android')
          ToastAndroid.show('Song added to the playlist', ToastAndroid.SHORT)
        // else {
        //   AlertIOS.alert('Song added to the playlist')
        // }
        AsyncStorage.setItem('playlists', JSON.stringify(playlists))
        this.setState({
          popupModal: false
        })
      }
      else{
        if(Platform.OS === 'android')
          ToastAndroid.show('Song already exist in the playlist',ToastAndroid.SHORT)
        else {
          AlertIOS.alert('Song already exist in the playlist')
        }
      }

    })
  }

  addNewPlaylist = (playlistName, data) => {
    // console.log(playlistName, data)
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = res ? JSON.parse(res) : {}
      if(!Object.keys(playlists).includes(data)){
        playlists[data] = []
        playlistName.push(data)
        this.setState({playlistName, addPlaylistModal: false, showPlaylists: true})
        AsyncStorage.setItem('playlists', JSON.stringify(playlists))
        if(Platform.OS === 'android')
          ToastAndroid.show('Playlist created',ToastAndroid.SHORT)
        // else {
        //   AlertIOS.alert('Playlist created')
        // }
      }
      else{
        if(Platform.OS === 'android')
          ToastAndroid.show('Playlist already exists',ToastAndroid.SHORT)
        else {
          AlertIOS.alert('Playlist already exists')
        }
      }
    })
  }

  createPlaylist = () => {
    this.setState({addPlaylistModal: true, showPlaylists: false})
  }

  showPlaylists = () => {
    this.setState({
      showPlaylists: true
    })
  }

  toggleQueueModal = () => {
    let { showQueue } = this.state
    this.setState({
      showQueue: !showQueue
    })
  }

  chooseTrackFromQueue = (index) => {
    this.toggleQueueModal()
    this.props.handleQueue(index)
  }

  render() {
    const { style, onNext, onPrevious, onTogglePlayback, navigation, playlistNames, handleQueue, shuffleTracks, songs, storageKey } = this.props;
    const { playbackState, track } = this.props
    var middleButtonText = 'Play'
    if (playbackState === TrackPlayer.STATE_PLAYING
      || playbackState === TrackPlayer.STATE_BUFFERING) {
      middleButtonText = 'Pause'
    }
    let path = require('../../../images/nav-heart.png')
    if (this.state.library)
      path = require('../../../images/library-active.png')
    return (
      <View style={styles.controller}>
        <PlayerModal
          active={this.state.popupModal}
          closeModal={this.toggleModal}
          navigateToScreen={this.navigateToScreen}
          song={track}
          showPlaylists={this.showPlaylists}
          viewPlaylists={this.state.showPlaylists}
          playlistName={this.state.playlistNames}
          ifInLibrary={this.state.library}
          addToPlaylist={this.addToPlaylist}
          addPlaylistModal={this.state.addPlaylistModal}
          songs={songs}
          createPlaylist={this.createPlaylist}
          addNewPlaylist={this.addNewPlaylist}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showQueue}
          onRequestClose={() => this.toggleQueueModal()}
        >
          <QueueList
            trackList={this.props.trackList}
            handleQueue={this.chooseTrackFromQueue}
            closeModal={this.toggleQueueModal}
          />
        </Modal>
        <Text style={styles.songTitle}>{track.title}</Text>
        <Text style={styles.songArtist}>{track.artist}</Text>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideSectionTopLeft} onPress={() => (this.state.library) ? removeFromLibrary(track, () => this.setState({library: false}) ) : addToLibrary(songs, track, (res) => this.setState({library: true}) )}>
            <Image source={path} style={styles.skipTrack} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideSectionTopRight} onPress={this.toggleModal}>
            <Image source={require('../../../images/elipsis.png')} style={styles.skipTrack} />
          </TouchableOpacity>
        </View>
        <ProgressBar />
        <Duration playbackState={playbackState} />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideSectionLeft} onPress={() => shuffleTracks()}>
            <Image source={require('../../../images/shuffle-white.png')} style={styles.skipTrack} />
          </TouchableOpacity>
          <ControlButton type={'back'} onPress={onPrevious} />
          <ControlButton type={playbackState === TrackPlayer.STATE_PLAYING ? 'pause' : (playbackState === TrackPlayer.STATE_BUFFERING) ? 'load' : 'play'} onPress={onTogglePlayback} />
          <ControlButton type={'skip'} onPress={onNext} />
          <TouchableOpacity style={styles.sideSectionRight} onPress={this.toggleQueueModal}>
            <Image source={require('../../../images/queue.png')} style={styles.skipTrack} />
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  controller: {
    height: 150,
    width: 350,
    marginTop: Dimensions.get('window').height * 0.60,
    alignItems: 'center'
  },
  skipTrack: {
    width: 17,
    height: 17,
    resizeMode: 'contain'
  },
  loadTrack: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15

  },
  songTitle: {
    fontSize: 19,
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    color: '#FFFFFF',
    textAlign: 'center'
  },
  songArtist: {
    paddingTop: 5,
    fontSize: 15,
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center'
  },
  sideSectionLeft: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'center'
  },
  sideSectionRight: {
    flex: 1,
    paddingRight: 10,
    alignItems: 'center'
  },
  sideSectionTopLeft: {
    flex: 1,
    paddingLeft: 20,
    alignItems: 'flex-start'
  },
  sideSectionTopRight: {
    flex: 1,
    paddingRight: 20,
    alignItems: 'flex-end'
  },
  leftTime: {
    height: 15,
    flex: 1,
    paddingLeft: 20,
    alignItems: 'flex-start'
  },
  rightTime: {
    height: 15,
    flex: 1,
    paddingRight: 20,
    alignItems: 'flex-end'
  },
  time: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
  },
  cover: {
    width: 140,
    height: 140,
    marginTop: 20,
    backgroundColor: 'grey',
  },
  progress: {
    height: 2,
    width: '96%',
    marginTop: 10,
    flexDirection: 'row',
  },
  title: {
    marginTop: 10,
  },
  artist: {
    fontWeight: 'bold',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
  },
  timeSecton: {
    marginTop: 10,
    height: 15,
    minHeight: 15,
    width: Dimensions.get('window').width * 0.95,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controls: {
    marginVertical: 0,
    marginBottom: 5,
    width: Dimensions.get('window').width * 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButtonContainer: {
    flex: 1,
    alignItems: 'center'
  },
  controlButtonText: {
    fontSize: 18,
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    textAlign: 'center',
  },
  playButton: {
    width: 60,
    height: 60
  },
  loaderCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'grey'

  }
});
