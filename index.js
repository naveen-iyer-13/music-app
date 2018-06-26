import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  AsyncStorage,
  Easing,
  StatusBar,
  YellowBox,
  AppState
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
  navigationOptions: {title: 'Welcome', header: null},
  transitionConfig : () => ({
  	transitionSpec: {
  		duration: 0,
  		timing: Animated.timing,
  		easing: Easing.step0,
  	},
  }),
});

class bibimpop extends Component{

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    StatusBar.setHidden(true);
    console.disableYellowBox = true;
  }

  _handleAppStateChange = (nextState) => {
    // console.log(nextState);
    if(nextState === 'background')
    AsyncStorage.removeItem('trendingSongs' ,() => {
      // console.log('clearing local storage')
      AppState.removeEventListener('change', this._handleAppStateChange);
    })
  }

  render() {
    return(
      <StackNavigation />
    )
  }
}

AppRegistry.registerComponent('bibimpop', () => bibimpop);
