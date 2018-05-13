import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Trending from './src/screens/trending'
import Library from './src/screens/library'
import Footer from './src/common/Footer'
import Player from './src/screens/player'
import Search from './src/screens/search'

const StackNavigation = StackNavigator ({
  Trending: { screen: Trending},
  Library: { screen: Library},
  Search: { screen: Search},
  Player: { screen: Player }
},{
  navigationOptions: {title: 'Welcome', header: null}
});

class bibimpop extends Component{
  componentWillUnmount(){
    this.clearStorage()
  }

  clearStorage = async() => {
    AsyncStorage.clear(() => console.log('clearing local storage'))
  }
  render() {
    return(
      <StackNavigation />
    )
  }
}

AppRegistry.registerComponent('bibimpop', () => bibimpop);
