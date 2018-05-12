import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  AlertIOS
} from 'react-native'

let { width, height } = Dimensions.get('window')

const SCREENS = [
  'Trending',
  'Library',
  'Search',
  'Player'
]

class Footer extends Component{
  constructor(props){
    super(props)
    this.state = {
      selectedScreen: 'Trending'
    }
  }
  navigate(screenName){
    console.log('navigate', screenName, this.props);
    this.props.navigation.navigate(screenName)
  }

  render() {
    const { screenName } = this.props
    var trending = screenName == 'Trending' ? require('.././images/library-active.png') : require('.././images/library.png')
    var library = screenName == 'Library' ? require('.././images/top100-active.png') :require('.././images/top100.png')
    var search = screenName == 'Search' ? require('.././images/search-active.png') :require('.././images/search.png')
    var playing = screenName == 'Playing' ? require('.././images/playing-active.png') :require('.././images/playing.png')

    return(
      <View style={styles.container}>
      <TouchableOpacity onPress={()=> screenName == 'Trending' ?  console.log('cant go'):this.navigate('Trending')}>
       <Image source={trending} style={{width: 30, height: 25}} resizeMode='contain'/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> screenName == 'Library' ?  console.log('cant go'):this.navigate('Library')}>
       <Image source={library} style={{width: 30, height: 25}} resizeMode='contain'/>
      </TouchableOpacity>
      <TouchableOpacity>
       <Image source={search} style={{width: 30, height: 25}} resizeMode='contain'/>
      </TouchableOpacity>
      <TouchableOpacity >
       <Image source={playing} style={{width: 30, height: 25}} resizeMode='contain'/>
      </TouchableOpacity>
      </View>
    )
  }
}
export default Footer

const styles = StyleSheet.create({
  container:{
    height: 55,
    width,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#CDCDCD',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    bottom: 0,
    justifyContent: 'space-around'
  }
})
