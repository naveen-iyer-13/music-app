import React from 'react'
import {
	View,
	Button,
	Text
} from 'react-native'
import MusicPlayerService, { Track, Events, RepeatModes } from 'react-native-music-player-service';
var songsInformation = [
    {
        id: "1",
        path: "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
        title: "track_1",
        album: "some album",
        artist: "some artist",
        genre: "some genre",
        duration: 2260,
        //artwork: "//path_to_image"
    }
]

const setNowPlayingConfig = {
  color: 0x2E2E2E,
  notificationIcon: 'my_custom_icon'
}

var musicPlayerService = new MusicPlayerService(true, setNowPlayingConfig);

var tracks = songsInformation.map(s => {
    return new Track({id: s.id, path: s.path, additionalInfo: s});
})

_event = (event, track) => { 
    console.log(event.toString() + ' has been raised with ' + track.toString());
}

class Player extends React.Component {

	componentWillMount() {
		

	}

	componentDidMount() {


		/* Initialization */
		musicPlayerService.addEventListener(Events.Play, track => _event(Events.Play, track));
		musicPlayerService.addEventListener(Events.Pause, track => _event(Events.Pause, track));
		musicPlayerService.addEventListener(Events.Next, track => _event(Events.Next, track));
		musicPlayerService.addEventListener(Events.Previous, track => _event(Events.Previous, track));
		musicPlayerService.addEventListener(Events.EndReached, track => _event(Events.EndReached, track));
		musicPlayerService.setQueue(tracks)
		  .then(returnedQueue => {
		      console.log('Queue has been set');
		      return musicPlayerService.togglePlayPause();
		  })
		  .then(() => {
		    console.log('Play or pause has been toggled');
		  });

	}

	

	playNext = () => {
		musicPlayerService.playNext();
	}

	render() {
		return (
			<View>
				<Button onPress={this.playNext()}
					title="Click"
				/>

			</View>
		)
	}
}

export default Player