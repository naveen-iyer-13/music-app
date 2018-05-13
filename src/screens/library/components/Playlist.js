import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage
} from 'react-native'
import { ListView } from './../../../common/ListView'

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

  getData = () => {
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = JSON.parse(res)
      console.log(playlists);
      if(playlists){
        this.setState({playlists})
      }
    })
  }

  render() {
    const { playlists } = this.state
    console.log(this.state);
    return(
      <View>
        {
          playlists && Object.keys(playlists).map(key => (
            <View>
              {
                  <ListView thumbnail={''} title={key} len={playlists[key].length}/>
              }
            </View>
          ))
        }
      </View>
    )
  }
}

export default Playlists
