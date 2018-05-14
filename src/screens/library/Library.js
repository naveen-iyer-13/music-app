
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
    this.setState({tab})
  }

  handlePlaylistOpen = (list, title) => {
    if(title){
      this.setState({header: title})
    }
  }

  render() {
    const { searchTerm, tab, header, closePlaylist, openCreatePlaylistModal } = this.state
    return (
      <View style={styles.container}>
      <LinearGradient colors={['#7AFFA0', '#62D8FF']} style={{height: 10, width: Dimensions.get('window').width}} />
        <View style={styles.screenContainer} navigation={this.props.navigation}>
          <Header
            header={header}
            tab={tab}
            handleBackButton={() => this.setState({closePlaylist: true, header: "Library"})}
            handleKeyPress={() => this.setState({openCreatePlaylistModal: true})}
          />
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
    height: height - 85 ,
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
