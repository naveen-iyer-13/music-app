
import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Footer from './../../common/Footer'
import Songs from './components/Songs'
import Playlists from './components/Playlist'
import { searchSong } from './../../common/helpers'

let { height, width } = Dimensions.get('window')

class Library extends Component{
  constructor(props){
    super(props)
    this.state = {
      tab: 'songs',
    }
  }

  handleTabPress = (tab) => {
    this.setState({tab})
  }

  render() {
    const { searchTerm, tab, searchList } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          <View style={styles.containerItem}>
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={() => this.handleTabPress('songs')}>
                <Text>Songs</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={() => this.handleTabPress('playlists')}>
                <Text>Playlists</Text>
              </TouchableOpacity>
            </View>
          </View>
            {
              tab === 'songs'
              ?
                <Songs searchList={searchList} navigation={this.props.navigation}/>
              :
              <View>
                <Playlists navigation={this.props.navigation}/>
              </View>
            }
        </View>
        <Footer screenName={'Library'} navigation={this.props.navigation}/>
      </View>
    )
  }
}

export default Library

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    backgroundColor: '#FFFFFF',
    width,
    height
  },
  screenContainer:{
    height: height - 80 ,
    paddingRight: 12,
    paddingLeft: 12
  },
  containerItem:{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '10%'
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
