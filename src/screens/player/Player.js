import React, { Component } from 'react'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, AsyncStorage, AppRegistry } from 'react-native';
import PlayerControll from './components/PlayerControll'
import Footer from './../../common/Footer'
import data from '../../common/data.json'
import {
  BarIndicator,
} from 'react-native-indicators';
// import { closeApp } from '../../common/helpers'
let { height, width } = Dimensions.get('window')
let trackList = []

export default class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			playbackState: "",
			track: {},
			trackList: [],
			songs: []
		}
	}

	componentWillMount() {
		if (this.props.navigation.state.params) {
		const { index, storageKey, name } = this.props.navigation.state.params
			AsyncStorage.getItem(storageKey, (err,res) => {
				if (name)
					trackList = JSON.parse(res)[name]
				else
					trackList = JSON.parse(res)
				let songs = trackList
				trackList.unshift(trackList[index])
				trackList.splice(index+1, 1)
				let obj, list = []
				trackList.forEach(track => {
					obj = {}
					obj.url = track.streamlink
					obj.artwork = track.cover
					obj.title = track.title
					obj.id = track.bp_id
					obj.artist = track.artist
					obj.thumbnail = track.thumbnail
					list.push(obj)
				})
				trackList = list
				this.setState({
					track: trackList[0],
					trackList: trackList,
					songs: songs
				})
			})
		}
		else {
			let index = 0, name = null
			AsyncStorage.getItem('trendingSongs', (err,res) => {
				if (name)
					trackList = JSON.parse(res)[name]
				else
					trackList = JSON.parse(res)
				let songs = trackList
				trackList.unshift(trackList[index])
				trackList.splice(index+1, 1)
				let obj, list = []
				trackList.forEach(track => {
					obj = {}
					obj.url = track.streamlink
					obj.artwork = track.cover
					obj.title = track.title
					obj.id = track.bp_id
					obj.artist = track.artist
					obj.thumbnail = track.thumbnail
					list.push(obj)
				})
				trackList = list
				this.setState({
					track: trackList[0],
					trackList: trackList,
					songs: songs
				})
			})
		}

	}

	componentDidMount() {
		let trackNext = {}
	    TrackPlayer.setupPlayer();

		TrackPlayer.registerEventHandler(async (data) => {
		  if (data.type === 'playback-track-changed') {
		    if (data.nextTrack) {
		      const track = await TrackPlayer.getTrack(data.nextTrack);
		      this.setState({
			  	track: track
			  })
		    }
		  } else if(data.type == 'remote-play') {
		    TrackPlayer.play()
		  } else if(data.type == 'remote-pause') {
		    TrackPlayer.pause()
		  } else if(data.type == 'remote-next') {
		    TrackPlayer.skipToNext()
		  } else if(data.type == 'remote-previous') {
		    TrackPlayer.skipToPrevious()
		  } else if (data.type === 'playback-state') {
		    this.setState({
		    	playbackState: data.state
		    })
		  }

		});
					TrackPlayer.reset()

		this.togglePlayback()
	    TrackPlayer.updateOptions({
	      stopWithApp: true,
	      capabilities: [
	        TrackPlayer.CAPABILITY_PLAY,
	        TrackPlayer.CAPABILITY_PAUSE,
	        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
	        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
	      ]
	    });
	}

	togglePlayback = async () => {
		const { playbackState } = this.state
	    const currentTrack = await TrackPlayer.getCurrentTrack();
	    if (currentTrack == null) {
	    	console.log('empty')
	      TrackPlayer.reset();
	      await TrackPlayer.add(trackList);
	      TrackPlayer.play();
	    } else {
	      if (playbackState === TrackPlayer.STATE_PAUSED) {
	        TrackPlayer.play();
	      } else {
	        TrackPlayer.pause();
	      }
	    }

	  }

	 	skipToNext = async () => {
	    try {
	      await TrackPlayer.skipToNext()
	    } catch (_) {
	      await TrackPlayer.skipToNext()
	    }
	  }

	  skipToPrevious = async () => {
	    try {
	      await TrackPlayer.skipToPrevious()
	    } catch (_) {}
	  }

	  handleQueue = async(index) => {
	  	trackList = [...trackList]
	  	trackList.unshift(trackList[index])
	  	trackList.splice(index+1, 1)
	  	TrackPlayer.reset()
	  	this.setState({
	  		track: trackList[0],
	  		trackList: trackList
	  	})
	  	this.togglePlayback()
	  }

	  shuffleArray = () => {
	  	trackList = [...trackList]
		    for (let i = trackList.length - 1; i > 0; i--) {
		        let j = Math.floor(Math.random() * (i + 1));
		        [trackList[i], trackList[j]] = [trackList[j], trackList[i]];
		    }
		    TrackPlayer.reset()
		    this.setState({
		  		track: trackList[0],
		  		trackList: trackList
		  	})
		    this.togglePlayback()
		}

	render() {

		const { playbackState, track, trackList } = this.state
		let index, storageKey
		 if (this.props.navigation.state.params) {
			index = this.props.navigation.state.params.index
			storageKey = this.props.navigation.state.params.storageKey
		}
		else {
			index = 0
			storageKey = 'trendingSongs'
		}
		//console.log('first', (playbackState === TrackPlayer.STATE_BUFFERING || playbackState === TrackPlayer.STATE_NONE || playbackState === TrackPlayer.STATE_STOPPED))
		return (

			<View style={styles.container}>
		        <View style={styles.backgroundContainer}>
					<Image
						style={styles.backgroundImage}
		            	source={{ uri: (playbackState === TrackPlayer.STATE_BUFFERING) ? track.thumbnail : track.artwork }}
		          	/>
		        </View>
		        <View style={styles.playerContainer}>
		            <PlayerControll
				          onNext={() => this.skipToNext()}
				          onPrevious={() => this.skipToPrevious()}
				          onTogglePlayback={() => this.togglePlayback()}
				          playbackState={playbackState}
				          track={track}
				          navigation={this.props.navigation}
				          trackList={trackList}
				          handleQueue={this.handleQueue}
				          shuffleTracks = {this.shuffleArray}
				          songs = {this.state.songs}
				          key={storageKey}
				    />
		        </View>
				<Footer screenName={'Player'} navigation={this.props.navigation}/>


			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	backgroundColor: '#eee',
  },
  backgroundContainer: {
  	position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
  	flex: 1,
	resizeMode: 'cover',
  },
  playerContainer: {
  flex: 1,
	backgroundColor: 'transparent',
	justifyContent: 'center',
	width: '100%',
	height: '100%',
	alignItems:'center',
	},

});
