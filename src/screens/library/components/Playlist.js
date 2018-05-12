import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage
} from 'react-native'

class Playlists extends Component{
  constructor(props){
    super(props)
    this.state = {
      playlists: null
    }
  }

  componentWillMount() {
    this.getData()
  }

  getData = async() => {
    let playlists = await AsyncStorage.getItem('playlists')
    if(playlists){
      this.setState({playlists})
    }
  }

  render() {
    const { playlists } = this.state
    return(
      <View>
        {
          playlists && playlists.length > 0 ? <ListView thumbnail={thumbnail} title={title}/> : <View/>
        }
      </View>
    )
  }
}

export default Playlists
