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
  Trending: { screen: Trending},
  Library: { screen: Library},
},{
  navigationOptions: {title: 'Welcome', header: null}
});

AppRegistry.registerComponent('bibimpop', () => bibimpop);
