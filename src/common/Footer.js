
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

const Footer = props => {

  return(
    <View style={{ height: 50,  backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',width:  Dimensions.get('window').width,borderTopWidth: 2, borderColor:'#D8D7E0', flexDirection: 'row'}}>
      <Text>Footer</Text>
    </View>
  );

}

export default Footer

const styles = StyleSheet.create({

})
