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

  handleKeyPress = (screen) => {
    this.setState({selectedScreen: screen})
  }

  render() {
    const { selectedScreen } = this.state
    return(
      <View style={styles.container}>
        {
          SCREENS.map(screen => (
            <TouchableOpacity key={screen} onPress={() => selectedScreen === screen ? {} : this.handleKeyPress(screen)}>
              <Text>{screen}</Text>
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
