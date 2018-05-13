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
		const { index, storageKey, name } = this.props.navigation.state.params
		AsyncStorage.getItem(storageKey, (err,res) => {
			if (name)
				trackList = JSON.parse(res)[name]
			else
				trackList = JSON.parse(res)

			trackList.unshift(trackList[index])
			trackList = trackList.splice(index+1, index+3)
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
				trackList: trackList
			})
		})
	}

	async componentDidMount() {
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
	  	trackList.unshift(trackList[index])
	  	trackList = trackList.splice(index+1, 1)
	  	TrackPlayer.reset()
	  	this.togglePlayback()
	  }

	render() {
		const { playbackState, track } = this.state
		const { song, index } = this.props.navigation.state.params
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
