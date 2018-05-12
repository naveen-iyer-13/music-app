import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
  ScrollView
} from 'react-native'

export default class SplashScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('.././images/splash.png')} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:undefined,
    width: undefined,
    backgroundColor: '#FFFFFF',
  }
});
