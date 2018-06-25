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
import LinearGradient from 'react-native-linear-gradient';

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

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedScreen: 'Trending'
    }
  }

  navigate(screenName) {
    this.props.navigation.navigate(screenName)
  }

  render() {
    const { screenName } = this.props
    let sty = styles.container

    let imgStyle = styles.imageStyle
    screenName === 'Player' ? imgStyle : sty = [sty, { backgroundColor: '#FFFFFF', borderTopWidth: 1 }]

    return (
      (screenName !== 'Player') ?
      <View style={sty}>
        {
          SCREENS.map((screen, index) => (
            <TouchableOpacity key={screen + index} onPress={() => screenName === screen ? {} : this.navigate(screen)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={screenName === screen ? SCREENICON[screen].active : SCREENICON[screen].inactive}
                style={imgStyle}
                resizeMode='contain'
              />
            </TouchableOpacity>
          ))
        }
      </View> :
      <View style={sty}>
      {
        SCREENS.map((screen, index) => (
          <TouchableOpacity key={screen + index} onPress={() => screenName === screen ? {} : this.navigate(screen)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={screenName === screen ? SCREENICON[screen].active : SCREENICON[screen].inactive}
              style={[imgStyle, index !== 3 ? {tintColor: '#FFFFFF'}: null ]}
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
  container: {
    height: 50,
    width,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  imageStyle: {
    width: 20,
    height: 20,
    padding: 5
  }
})
