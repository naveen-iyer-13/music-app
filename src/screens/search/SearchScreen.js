import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native'
import { Search } from './../../common/Search'
import Footer from './../../common/Footer'
import { ListView } from './../../common/ListView'
import { searchSong } from './../../common/helpers'

let { height, width } = Dimensions.get('window')


class SearchScreen extends Component{
  constructor(props){
    super(props)
    this.state = {
      searchList: [],
      searchTerm: ''
    }
  }

  handleSearch = (text) => {
    searchSong(text, res => {
      if(res)
        this.setState({list: res})
      else
        this.setState({list: []})
    })
  }

  render(){
    const { list, searchTerm } = this.state
    return(
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          <Search
            searchTerm={searchTerm}
            handleSearch={this.handleSearch}
          />
          <ScrollView>
            {
              list && list.map((song,index) => (
                <ListView key={song.title + index} thumbnail={song.thumbnail} title={song.title}/>
              ))
            }
          </ScrollView>
        </View>
        <Footer screenName={'Search'} navigation={this.props.navigation}/>
      </View>
    )
  }
}

export default SearchScreen

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    backgroundColor: '#FFFFFF',
    width,
    height
  },
  screenContainer:{
    height: height - 80,
    paddingRight: 12,
    paddingLeft: 12
  },
})
