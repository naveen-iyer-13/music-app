import React, { Component } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'

export const Search = ({handleSearch, searchTerm, clearText}) => (
  <View style={styles.searchBox}>
    <Image source={require('.././images/search.png')} style={{resizeMode: 'contain', height: 15, width: 15, marginLeft: 10}}/>
    <TextInput
      onChangeText={(text) => handleSearch(text)}
      placeholder={"Search"}
      value={searchTerm}
      underlineColorAndroid={'transparent'}
      placeholderColor={'#000000'}
      style={styles.searchInput}
    />
    {
      searchTerm
       ?
      <TouchableOpacity onPress={() => clearText()}>
       <Image source={require('.././images/cancel.png')} style={{resizeMode: 'contain', height: 10, width: 10, marginLeft: 10}}/>
      </TouchableOpacity>
      : <View />
    }
  </View>
)

const styles = StyleSheet.create({
  searchBox: {
    width: Dimensions.get('window').width - 20,
    height: 35,
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  },
  searchInput: {
    width: '85%',
    height: 35,
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    alignItems: 'center',
    //fontFamily: '',
    padding: 5,
    color: '#000'
  }
})
