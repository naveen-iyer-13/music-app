
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
import Header from './../../common/Header'

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
        <View style={styles.screenContainer} navigation={this.props.navigation}>
          <Header header={'Library'} navigation={this.props.navigation} path={tab}/>
          <View style={styles.containerItem}>
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={() => this.handleTabPress('songs')}>
                <Text style={{fontSize: 16, color: tab == 'songs' ? '#6DEAD3' : '#C9C9C9', fontFamily: 'Proxima-Nova-Bold'}}>Songs</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerItem2}>
              <TouchableOpacity onPress={() => this.handleTabPress('playlists')}>
                <Text style={{fontSize: 16, color: tab == 'songs' ? '#C9C9C9' : '#6DEAD3', fontFamily: 'Proxima-Nova-Bold'}}>Playlists</Text>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').heights
  },
  screenContainer:{
    height: height - 75 ,
    paddingRight: 12,
    paddingLeft: 12
  },
  containerItem:{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 30,
    marginTop: 10,
    marginBottom: 15
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderColor: '#D8D8D8'
  },
  headerItem2: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
