
import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native'
import Footer from './../../common/Footer'
import Songs from './components/Songs'
import Playlists from './components/Playlist'
import { searchSong } from './../../common/helpers'
import Header from './../../common/Header'
import LinearGradient from 'react-native-linear-gradient';
let { height, width } = Dimensions.get('window')

class Library extends Component{
  constructor(props){
    super(props)
    this.state = {
      tab: 'songs',
      header: 'Library'
    }
  }

  handleTabPress = (tab) => {
    if(tab === 'songs')
      this.setState({tab, header: 'Library'})
    else
      this.setState({tab})
  }

  handlePlaylistOpen = (list, title) => {
    if(title){
      this.setState({header: title})
    }
  }

  render() {
    const { searchTerm, tab, header, closePlaylist, openCreatePlaylistModal } = this.state
    console.log(this.state)
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#7AFFA0', '#62D8FF']}
          style={{height: Platform.OS === 'android' ? 10 : 5, width: Dimensions.get('window').width}}
          start={{x: 0.0, y: 0.5}} end={{x: 0.5, y: 1.0}}
        />
       <View style={styles.screenContainer} navigation={this.props.navigation}>
          <Header
            header={header}
            tab={tab}
            handleBackButton={() => this.setState({closePlaylist: true, header: "Library"})}
            handleKeyPress={() => this.setState({openCreatePlaylistModal: true})}
          />
          <View style={styles.containerItem}>
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={() => tab !== 'songs' ? this.handleTabPress('songs') : {}}>
                <Text style={{fontSize: 16, color: tab == 'songs' ? '#6DEAD3' : '#C9C9C9', fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",}}>SONGS</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerItem2}>
              <TouchableOpacity onPress={() => tab === 'songs' ? this.handleTabPress('playlists') : {}}>
                <Text style={{fontSize: 16, color: tab == 'songs' ? '#C9C9C9' : '#6DEAD3', fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",}}>PLAYLISTS</Text>
              </TouchableOpacity>
            </View>
          </View>
            {
              tab === 'songs'
              ?
                <Songs navigation={this.props.navigation}/>
              :
              <View>
                <Playlists
                  navigation={this.props.navigation}
                  closePlaylist={closePlaylist}
                  handlePlaylistOpen={this.handlePlaylistOpen}
                  reset={() => this.setState({closePlaylist: false})}
                  openCreatePlaylistModal={openCreatePlaylistModal}
                  handleModalClose={() => this.setState({openCreatePlaylistModal: false})}
                />
              </View>
            }
        </View>
        <View style={{bottom:0, position:'absolute'}}>
          <Footer screenName={'Library'} navigation={this.props.navigation}/>
        </View>
      </View>
    )
  }
}

export default Library

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex:1,
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').heights
  },
  screenContainer:{
    height: Platform.OS === 'android' ? height - 85 : height - 70,
  },
  containerItem:{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 30,
    marginBottom: 15
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
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
