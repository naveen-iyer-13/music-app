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

const SCREENICON = {
  Trending: {
    active: require('.././images/top100-active.png'),
    inactive: require('.././images/top100.png')
  },
  Library: {
    active: require('.././images/library-active.png'),
    inactive: require('.././images/library.png')
  },
  Search: {
    active: require('.././images/search-active.png'),
    inactive: require('.././images/search.png')
  },
  Player: {
    active: require('.././images/playing-active.png'),
    inactive: require('.././images/playing.png')
  }

}

class Footer extends Component{
  constructor(props){
    super(props)
    this.state = {
      selectedScreen: 'Trending'
    }
  }

  navigate(screenName){
    this.props.navigation.navigate(screenName)
  }

  render() {
    const { screenName } = this.props

    return(
      <View style={styles.container}>
        {
          SCREENS.map(screen => (
            <TouchableOpacity onPress={()=> screenName === screen ?  {} : this.navigate(screen)}>
              <Image
                source={screenName === screen ? SCREENICON[screen].active : SCREENICON[screen].inactive}
                style={{width: 20, height: 20}}
                resizeMode='contain'
              />
            </TouchableOpacity>
          ))
        }
      </View>
    )
  }
}
export default Footer

const styles = StyleSheet.create({
  container:{
    height: 50,
    width,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#EBEBEB',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    bottom: 0,
    justifyContent: 'space-around'
  }
})
