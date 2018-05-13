import React, { Component } from 'react'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import PlayerControll from './components/PlayerControll'
import Footer from './../../common/Footer'
import data from '../../common/data.json'
let { height, width } = Dimensions.get('window')

export default class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			playbackState: "",
			track: {}
		}
	}

	componentDidMount() {
		let track = {}
	    TrackPlayer.setupPlayer();
	    TrackPlayer.registerEventHandler(async (data) => {
		  if (data.type === 'playback-track-changed') {
		    if (data.nextTrack) {
		      const track = await TrackPlayer.getTrack(data.nextTrack);
		      track.title = track.title
		      track.artist = track.artist;
		      track.artwork = track.artwork;
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
		  this.setState({
		  	track
		  })
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
	      await TrackPlayer.add(data);
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
		return (
			<View style={styles.container}>
				<PlayerControll
		          //style={styles.player}
		          onNext={() => this.skipToNext()}
		          onPrevious={() => this.skipToPrevious()}
		          onTogglePlayback={() => this.togglePlayback()}
		          playbackState={playbackState}
		          track={track}
		    />
				<Footer screenName={'Search'} navigation={this.props.navigation}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000000',
    height,
    width,
  }
});
