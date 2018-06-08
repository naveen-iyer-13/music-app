import React, { Component } from 'react'
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	Image,
	ToastAndroid,
	AsyncStorage,
	AppRegistry,
	EventEmitter
} from 'react-native';
import PlayerControll from './components/PlayerControll'
import Footer from './../../common/Footer'
// import data from '../../common/data.json'
import { BASE_URL } from '../../utils/config/ApiConf'
import {
	BarIndicator,
} from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';

// import { closeApp } from '../../common/helpers'
let { height, width } = Dimensions.get('window')
let trackList = []

export default class Player extends Component {

	constructor(props) {
		super(props)
		this.state = {
			playbackState: -1,
			track: {},
			trackList: [],
			songs: [],
			lastState: -1
		}
	}

	componentWillMount() {
		if (this.props.navigation.state.params ) {
			const { index, storageKey, name, search } = this.props.navigation.state.params
			if (search) {
				let songs = search
				trackList = search
				let obj, list = []
				let first =index
				trackList.forEach((track, i) => {
					obj = {}
					obj.url = `${BASE_URL}/stream/${track.bp_id}`
					obj.artwork = track.cover
					obj.title = track.title
					obj.id = i.toString()
					obj.bp_id = track.bp_id
					obj.artist = track.artist
					obj.thumbnail = track.thumbnail
					list.push(obj)
				})
				trackList = list
				this.setState({
					track: list[index],
					trackList: trackList,
					songs: songs
				}, () =>{
					if (this.props.navigation.state.params) {
						TrackPlayer.reset()
						this.togglePlayback(index)
					}
				})
			}
			else																												//Handle Queues from Library/Trending/Playlist
				AsyncStorage.getItem(storageKey, (err, res) => {
					if (name)
						trackList = JSON.parse(res)[name]
					else
						trackList = JSON.parse(res)
					trackList = trackList ? trackList : []
					let songs = trackList
					let obj, list = []
					trackList.forEach((track, i) => {
						obj = {}
						obj.url = track.streamlink
						obj.artwork = track.cover
						obj.title = track.title
						obj.id = i.toString()
						obj.bp_id = track.bp_id
						obj.artist = track.artist
						obj.thumbnail = track.thumbnail
						list.push(obj)

					})
					trackList = list
					this.setState({
						track: trackList[index],
						trackList: trackList,
						songs: songs
					}, () =>{
					if (this.props.navigation.state.params) {
						TrackPlayer.reset()
						this.togglePlayback(index)
					}
				})

				})
		}
		else {																									//Handle Now Playing
			let queue = []
			TrackPlayer.getQueue()
			.then(results => {
				if (results.length === 0)
					this.fetchFromTrending()
				else {
					queue = results
					TrackPlayer.getCurrentTrack()
					.then(async(currTrackId) => {
						let track = await TrackPlayer.getTrack(currTrackId)
						let state = TrackPlayer.STATE_PLAYING
						TrackPlayer.getState()
						.then(state =>{
							state = state
							this.setState({
								track: track,
								playbackState: state
							})
						})

					})
					.catch(err => console.log("Error"))
				}

			})
			.catch(err => {
				this.fetchFromTrending()
			})
		}

	}

	fetchFromTrending() {
		let index = 0, name = null
		AsyncStorage.getItem('trendingSongs', (err,res) => {
			if (name)
				trackList = JSON.parse(res)[name]
			else
				trackList = JSON.parse(res)
			let songs = trackList
			let obj, list = []
			let first = index
			if(trackList){
				trackList.forEach((track, i) => {
					obj = {}
					obj.url = track.streamlink
					obj.artwork = track.cover
					obj.title = track.title
					obj.bp_id = track.bp_id
					obj.id = i.toString()
					obj.artist = track.artist
					obj.thumbnail = track.thumbnail
					list.push(obj)
				})
			}
			trackList = list
			this.setState({
				track: list[index],
				trackList: trackList,
				songs: songs
			}, () =>{
					if (this.props.navigation.state.params) {
						TrackPlayer.reset()
						this.togglePlayback(index)
					}
				})
		})
	}

	componentDidMount() {
		TrackPlayer.setupPlayer();
		console.log('player setup');
	//	if (!TrackPlayer.STATE_PLAYING && !TrackPlayer.STATE_BUFFERING  && !TrackPlayer.STATE_NONE && !TrackPlayer.STATE_PAUSED && !TrackPlayer.STATE_STOPPED)
			TrackPlayer.registerEventHandler(async (data) => {
				if (data.type === 'playback-track-changed') {
					if (data.nextTrack) {
						const track = await TrackPlayer.getTrack(data.nextTrack);
						this.setState({
							track: track
						})
					}
				} else if (data.type == 'remote-play') {
					TrackPlayer.play()
				} else if (data.type == 'remote-pause') {
					TrackPlayer.pause()
				} else if (data.type == 'remote-next') {

					TrackPlayer.skipToNext()
				} else if (data.type == 'remote-previous') {

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
	componentWillUnmount() {
		//AppRegistry.removeDeviceListeners()
	}

	togglePlayback = async (first) => {
		let { playbackState, trackList } = this.state
		const currentTrack = await TrackPlayer.getCurrentTrack();
		console.log(currentTrack);
		if (!currentTrack) {
			TrackPlayer.reset();
			// trackList = [...trackList]
			trackList = trackList.map(item => ({id: item.id, title: item.title, artist: item.artist, url: item.url ? item.url : 'http://s3.amazonaws.com/bibimpop-tracks/zywuerk9.mp3'}))
			await TrackPlayer.add(trackList);
			console.log(await TrackPlayer.getQueue())
			if (first) {
				let id = parseInt(first)
		while(!trackList[id].url || trackList[id].url === 'processing')
			id++
		if (id !== parseInt(first))
			ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				await TrackPlayer.skip(id.toString())
			}
			TrackPlayer.play();
		} else {
			if (playbackState === TrackPlayer.STATE_PAUSED || first) {
				if (first) {
					let id = parseInt(first)
		while(!trackList[id].url || trackList[id].url === 'processing')
			id++
		if (id !== parseInt(first))
			ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				await TrackPlayer.skip(id.toString())
				}
				console.log("Play")
				TrackPlayer.play();
			} else {
				console.log("Pause")
				TrackPlayer.pause();
			}
		}
	}

	skipToNext = async () => {
		try {
			let trackId = await TrackPlayer.getCurrentTrack()
			let id = parseInt(trackId)
			id = id+1
			let j = id
			while (!trackList[id].url || trackList[id].url === "processing") {
				//ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				id++

			}
			if (j !== id)
				ToastAndroid.show("Song not available", ToastAndroid.SHORT)
			id = id.toString()
			await TrackPlayer.skip(id)

		} catch (_) {
			await TrackPlayer.skipToNext()
		}
	}

	skipToPrevious = async () => {
		try {
			let trackId = await TrackPlayer.getCurrentTrack()
			let id = parseInt(trackId)
			id = (id === 0) ? 0 : id-1
			let j = id
			while (!trackList[id].url || trackList[id].url === "processing") {
				//ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				if(id === 0)
					break
				id = (id === 0) ? 0 : id-1

			}
			if (j !== id)
				ToastAndroid.show("Song not available", ToastAndroid.SHORT)
			id = id.toString()
			await TrackPlayer.skip(id)
		} catch (_) { }
	}

	handleQueue = async (index) => {

		//await TrackPlayer.skip(id.toString())
		this.togglePlayback(index)
	}

	shuffleArray = () => {
		t = [...trackList]
		for (let i = t.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[t[i], t[j]] = [t[j], t[i]];
		}
		TrackPlayer.reset()
		this.setState({
			track: t[0],
			trackList: t

		}, () => {
			TrackPlayer.reset()
			this.togglePlayback(0)
		})

	}



	render() {
		const { playbackState, track } = this.state
		let index, storageKey
		if (this.props.navigation.state.params) {
			index = this.props.navigation.state.params.index
			storageKey = this.props.navigation.state.params.storageKey
		}
		else {
			index = 0
			storageKey = 'trendingSongs'
		}
		return (

			<View style={styles.container}>
				<View style={styles.backgroundContainer}>
					<Image
						style={styles.backgroundImage}
						source={{ uri: (playbackState === TrackPlayer.STATE_BUFFERING) ? track.thumbnail : (track.artwork ? track.artwork : track.cover) }}
					/>
				</View>
				<LinearGradient colors={['#FFFFFF','#D8D8D8', '#4A4A4A','#000000']} style={styles.playerContainer}>
					<PlayerControll
						onNext={() => this.skipToNext()}
						onPrevious={() => this.skipToPrevious()}
						onTogglePlayback={() => this.togglePlayback()}
						playbackState={playbackState}
						track={track}
						navigation={this.props.navigation}
						trackList={trackList}
						handleQueue={this.handleQueue}
						shuffleTracks={this.shuffleArray}
						songs={this.state.songs}
						storageKey={storageKey}
					/>
				</LinearGradient>
				<View style={{backgroundColor: '#000000', opacity: 0.7}}>
					<Footer screenName={'Player'} navigation={this.props.navigation} />
				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
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
		// backgroundColor: '#000000',
		opacity: 0.6,
		justifyContent: 'center',
		width: '100%',
		height: Dimensions.get('window').height - 80,
		alignItems: 'center',
	},

});
