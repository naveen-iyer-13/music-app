import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Trending from './src/screens/trending/Trending.js'

const bibimpop = StackNavigator ({
  Trending: { screen: Trending},
},{navigationOptions: {title: 'Welcome', header: null}});

AppRegistry.registerComponent('bibimpop', () => bibimpop);
