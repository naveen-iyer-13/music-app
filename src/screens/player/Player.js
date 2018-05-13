import React, { Component } from 'react'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, AsyncStorage, AppRegistry } from 'react-native';
import PlayerControll from './components/PlayerControll'
import Footer from './../../common/Footer'
import data from '../../common/data.json'
// import { closeApp } from '../../common/helpers'
let { height, width } = Dimensions.get('window')
let trackList = []

export default class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			playbackState: "",
			track: {},
			trackList: []
		}
	}

	componentWillMount() {
		const { index, storageKey } = this.props.navigation.state.params
		AsyncStorage.getItem(storageKey, (err,res) => {
			trackList = JSON.parse(res)
			trackList.unshift(trackList[index])
			trackList = trackList.slice(index+1, index+3)
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
				track: trackList[0]
			})
		})
	}

	componentDidMount() {
		let trackNext = {}
	    TrackPlayer.setupPlayer();
		TrackPlayer.registerEventHandler(async (data) => {
		  if (data.type === 'playback-track-changed') {
		    if (data.nextTrack) {
		      const track = await TrackPlayer.getTrack(data.nextTrack);
		      trackNext.title = track.title
		      trackNext.artist = track.artist;
		      trackNext.artwork = track.artwork;
		      trackNext.thumbnail = track.thumbnail;
		      this.setState({
			  	track: trackNext
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

	render() {
		const { playbackState, track } = this.state
		const { song, index } = this.props.navigation.state.params
		return (

			<View style={styles.container}>
		        <View style={styles.backgroundContainer}>
					<Image 
						style={styles.backgroundImage}
		            	source={{ uri: playbackState === TrackPlayer.STATE_BUFFERING ? track.artwork : track.artwork }}
		          	/>
		        </View>
		        <View style={styles.playerContainer}>
		            <PlayerControll
				          onNext={() => this.skipToNext()}
				          onPrevious={() => this.skipToPrevious()}
				          onTogglePlayback={() => this.togglePlayback()}
				          playbackState={playbackState}
				          track={track}
				    />
		        </View>
				<Footer screenName={'Search'} navigation={this.props.navigation}/>
				
				
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
	height: '100%'
	},
	
});
