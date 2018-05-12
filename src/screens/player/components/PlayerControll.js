import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, Dimensions } from 'react-native';

class ProgressBar extends ProgressComponent {
  render() {
    return (
      <View style={styles.progress}>
        <View style={{ flex: this.getProgress(), backgroundColor: 'red' }} />
        <View style={{ flex: 1 - this.getProgress(), backgroundColor: 'white' }} />
      </View>
    );
  }
}

function ControlButton({ type, onPress }) {
  let buttonTypePath = '../../../images/'+type+'.png'
  return (
    <TouchableOpacity style={styles.controlButtonContainer} onPress={onPress}>
        <Image 
          source={{uri: buttonTypePath}} 
          style={ type !== 'back' && type !== 'skip' ? styles.playButton : styles.skipTrack}
        />
    </TouchableOpacity>
  );
}

ControlButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default class PlayerControll extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onTogglePlayback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {}
  };

  render() {
    const { style, onNext, onPrevious, onTogglePlayback } = this.props;
    const { playbackState, track } = this.props
    console.log(playbackState, 'play')
    var middleButtonText = 'Play'

    if (playbackState === TrackPlayer.STATE_PLAYING
      || playbackState === TrackPlayer.STATE_BUFFERING) {
      middleButtonText = 'Pause'
    }

    return (
      <View style={styles.controller}>
        <ProgressBar />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideSectionLeft}>
            <Image source={require('../../../images/shuffle.png')} style={styles.skipTrack}/>
          </TouchableOpacity>
          <ControlButton type={'back'} onPress={onPrevious}  />
          <ControlButton type={playbackState === 2 ? 'play' : 'pause'} onPress={onTogglePlayback} />
          <ControlButton type={'skip'} onPress={onNext}/>
           <TouchableOpacity style={styles.sideSectionRight}>
            <Image source={require('../../../images/queue.png')} style={styles.skipTrack}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  controller: {
    height: 100,
    width: 350,
    marginTop: Dimensions.get('window').height * 0.70,
    alignItems: 'center'
  },
  skipTrack: {
    width: 15,
    height: 15
  },

  card: {
    width: '80%',
    elevation: 1,
    borderRadius: 4,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    alignItems: 'center',
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 1},
  },
  sideSectionLeft: {
    flex:1,
    paddingLeft: 10
  },
  sideSectionRight: {
    flex:1,
    paddingRight: 10
  },
  cover: {
    width: 140,
    height: 140,
    marginTop: 20,
    backgroundColor: 'grey',
  },
  progress: {
    height: 1,
    width: '90%',
    marginTop: 10,
    flexDirection: 'row',
  },
  title: {
    marginTop: 10,
  },
  artist: {
    fontWeight: 'bold',
  },
  controls: {
    marginVertical: 40,
    width: Dimensions.get('window').width * 0.95,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  controlButtonContainer: {
    flex: 1,
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  playButton: {
    width: 40,
    height: 40
  }
});
