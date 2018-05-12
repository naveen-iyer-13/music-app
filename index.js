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

const bibimpop = StackNavigator ({
  Library: { screen: Library},
  Trending: { screen: Trending},
},{
  navigationOptions: {title: 'Welcome', header: null}
});

AppRegistry.registerComponent('bibimpop', () => bibimpop);
