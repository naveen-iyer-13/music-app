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
	EventEmitter,
	AlertIOS,
	Platform
} from 'react-native';
import PlayerControll from './components/PlayerControll'
import { getStreamingUrl } from './../../common/helpers'
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

			lastState: -1,
			ifSearch: false,
			backgroundImageBlur: 1

		}
	}

	componentWillMount() {
		this.handlePlayer(this.props)

	}

	componentWillReceiveProps(nextProps) {
		this.handlePlayer(nextProps)
	}

	resetPlayer = async (cb) => {
		TrackPlayer.reset()
		let currSong = await TrackPlayer.getCurrentTrack()
		if (!currSong)
			cb()
	}

	handlePlayer = (props) => {
		if (props.navigation.state.params && props.navigation.isFocused()) {
			const { index, storageKey, name, search } = props.navigation.state.params
			if (search) {
				let songs = search

				trackList = search
				let obj, list = []
				let first = index
				trackList.forEach((track, i) => {
					obj = {}
					obj.url = 'processing'
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

					ifSearch: true,
					track: trackList[index],
					trackList: trackList,
					songs: songs
				}, () => {
					if (props.navigation.state.params) {
						TrackPlayer.reset()
						this.togglePlayback(index)
					}
				})
				// obj = {}
				// obj.url = track.url ? track.url : 'processing'
				// obj.artwork = track.cover
				// obj.title = track.title
				// obj.id = index.toString()
				// obj.bp_id = track.bp_id
				// obj.artist = track.artist
				// obj.thumbnail = track.thumbnail
				// currentTrack = obj
				// this.resetPlayer(() =>
				// 	this.setState({ track:  currentTrack, playbackState: TrackPlayer.STATE_BUFFERING})
				// )
				// getStreamingUrl(trackList, (data) => {
				// 	data.forEach((track, i) => {
				// 		obj = {}
				// 		obj.url = track.url && track.url.length > 0 ? track.url : 'processing'
				// 		obj.artwork = track.cover
				// 		obj.title = track.title
				// 		obj.id = i.toString()
				// 		obj.bp_id = track.bp_id
				// 		obj.artist = track.artist
				// 		obj.thumbnail = track.thumbnail
				// 		list.push(obj)
				// 	})
				// 	this.setState({
				// 		trackList: list,
				// 		songs: songs
				// 	}, () =>{
				// 		if (props.navigation.state.params) {
				// 			console.log('Start again')
				// 			TrackPlayer.reset()
				// 			this.togglePlayback(index)
				// 		}
				// 	})
				// })
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
						obj.url = track.streamlink.length > 0 ? track.streamlink : 'processing'
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

						songs: songs,
						ifSearch: false
					}, () => {
						if (props.navigation.state.params) {
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
							.then(async (currTrackId) => {
								let track = await TrackPlayer.getTrack(currTrackId)
								let state = TrackPlayer.STATE_PLAYING
								TrackPlayer.getState()
									.then(state => {
										state = state
										this.setState({
											track: track,
											playbackState: state,
											ifSearch: false

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
		AsyncStorage.getItem('trendingSongs', (err, res) => {
			if (name)
				trackList = JSON.parse(res)[name]

			trackList = JSON.parse(res)
			let songs = trackList
			let obj, list = []
			let first = index
			if (trackList) {
				trackList.forEach((track, i) => {
					obj = {}

					obj.url = track.streamlink.length > 0 ? track.streamlink : 'processing'
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

				songs: songs,
				ifSearch: false
			}, () => {
				if (this.props.navigation.state.params) {
					TrackPlayer.reset()
					this.togglePlayback(index)
				}
			})
		})
	}

	componentDidMount() {
		TrackPlayer.setupPlayer();
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
	// componentWillUnmount() {
	// 	//AppRegistry.removeDeviceListeners()
	// }

	getNewTrackList = (index) => {
		let { trackList } = this.state
		let t = [{ ...trackList[index] }]
		let obj = {}, track
		getStreamingUrl(t, (data) => {
			track = data[0]
			if (track.url === 'processing')
				if (Platform.OS === 'android')
					ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				else {
					AlertIOS.alert('Song not available')
				}
			obj.url = track.url && track.url.length > 0 ? track.url : 'processing'
			obj.artwork = track.cover
			obj.title = track.title
			obj.id = index.toString()
			obj.bp_id = track.bp_id
			obj.artist = track.artist
			obj.thumbnail = track.thumbnail
			trackList[index] = obj
		})

		return trackList
	}

	togglePlayback = async (first) => {

		let { playbackState, trackList, ifSearch } = this.state
		const currentTrack = await TrackPlayer.getCurrentTrack();
		if (!currentTrack || ifSearch) {
			TrackPlayer.reset();

			if (ifSearch && first)
				trackList = this.getNewTrackList(first)
			await TrackPlayer.add(trackList);
			if (first) {
				let id = parseInt(first)
				while (!trackList[id].url || trackList[id].url === 'processing')
					id++
				if (id !== parseInt(first)) {
					if (Platform.OS === 'android')
						ToastAndroid.show("Song not available", ToastAndroid.SHORT)
					else {
						AlertIOS.alert('Song not available')
					}
				}
				await TrackPlayer.skip(id.toString())
			}
			TrackPlayer.play();
		} else {
			if (playbackState === TrackPlayer.STATE_PAUSED || first) {
				if (first) {
					let id = parseInt(first)
					while (!trackList[id].url || trackList[id].url === 'processing')
						id++
					if (id !== parseInt(first)) {
						if (Platform.OS === 'android')
							ToastAndroid.show("Song not available", ToastAndroid.SHORT)
						else {
							AlertIOS.alert('Song not available')
						}

					}
					await TrackPlayer.skip(id.toString())
				}
				// console.log("Play")
				TrackPlayer.play();
			} else {
				// console.log("Pause")
				TrackPlayer.pause();
			}
		}
	}

	skipToNext = async () => {
		try {
			let trackId = await TrackPlayer.getCurrentTrack()
			let id = parseInt(trackId)

			id = id + 1
			let j = id
			while (!trackList[id - 1].url || trackList[id - 1].url === "processing") {
				//ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				id++

			}
			if (j !== id)
				if (Platform.OS === 'android')
					ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				else {
					AlertIOS.alert("Song not available")
				}
			id = id.toString()
			TrackPlayer.play()
			await TrackPlayer.skip(id)
		} catch (_) {
			await TrackPlayer.skipToNext()
		}
	}

	skipToPrevious = async () => {
		try {
			let trackId = await TrackPlayer.getCurrentTrack()
			let id = parseInt(trackId)
			id = (id === 0) ? 0 : id - 1
			let j = id

			while (!trackList[id - 1].url || trackList[id - 1].url === "processing") {
				//ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				if (id === 0)
					break
				id = (id === 0) ? 0 : id - 1

			}
			if (j !== id)
				if (Platform.OS === 'android')
					ToastAndroid.show("Song not available", ToastAndroid.SHORT)
				else {
					AlertIOS.alert("Song not available")
				}
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
		console.log('Track: ', this.state.track);
		const { backgroundImageBlur, playbackState, track } = this.state
		let index, storageKey
		if (this.props.navigation.state.params) {
			index = this.props.navigation.state.params.index
			storageKey = this.props.navigation.state.params.storageKey
		}
		else {
			index = 0
			storageKey = 'trendingSongs'
		}
		let imageBlur = 1;
		(playbackState === TrackPlayer.STATE_BUFFERING || playbackState === -1 || playbackState === 'stopped') ? imageBlur = 1 : imageBlur = 0
		return (

			<View style={styles.container}>
				<LinearGradient
					colors={['#7AFFA0', '#62D8FF']}
					style={{ height: 5, width: Dimensions.get('window').width, zIndex: 2000 }}
					start={{ x: 0.0, y: 0.5 }} end={{ x: 0.5, y: 1.0 }}
				/>
				<View style={styles.backgroundContainer}>
					<Image
						blurRadius={imageBlur}
						style={styles.backgroundImage}
						source={{ uri: (playbackState === TrackPlayer.STATE_BUFFERING) ? track.thumbnail : (track.artwork ? track.artwork : track.cover) }}
					/>
				</View>
				<LinearGradient colors={['#FFFFFF', '#D8D8D8', '#000000']} style={styles.playerContainer}>
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
					<View style={styles.footerContainer}>
						<Footer screenName={'Player'} navigation={this.props.navigation} />
					</View>
				</LinearGradient>

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
		opacity: 0.7,
		justifyContent: 'center',
		width: '100%',
		height: Dimensions.get('window').height - 80,
		alignItems: 'center',
	},
	footerContainer: {
		position: 'absolute',
		bottom: 0,
		borderTopColor: 'rgba(255, 255, 255, 0.3)',
		borderTopWidth: 1
	}

});
