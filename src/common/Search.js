import React, { Component } from 'react'
import {
  View,
  TextInput,
  StyleSheet
} from 'react-native'

export const Search = ({handleSearch, searchTerm}) => (
  <View style={styles.searchBox}>
    <TextInput
      onChange={(text) => handleSearch(text)}
      placeholder={"Search"}
      underlineColorAndroid={'transparent'}
      placeholderColor={'#000000'}
      style={styles.searchBox}
    />
  </View>
)

const styles = StyleSheet.create({
  searchBox: {
    width: '100%',
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 4,
  }
})
