import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Trending from './src/screen/trending/Trending.js'
const GocoolSolutions = StackNavigator ({
  Trending: { screen: Trending},
},{navigationOptions: {title: 'Welcome', header: null}});

AppRegistry.registerComponent('GocoolSolutions', () => GocoolSolutions);
