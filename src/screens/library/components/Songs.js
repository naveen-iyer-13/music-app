import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage
} from 'react-native'
import { getTrending } from './../../../common/helpers'
import { ListView } from './../../../common/ListView'

class Songs extends Component{
  constructor(props){
    super(props)
    this.state = {
      list:[],
      searchList: []
    }
  }

  componentWillMount() {
    this.getSongs()
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.searchList){
      this.setState({searchList: nextProps.searchList})
    }
  }

  getSongs(){
    AsyncStorage.getItem('trendingSongs', (err, res) => {
      if(res)
        this.setState({list: JSON.parse(res), loading: false})
      else
        getTrending((list) => {
          this.setState({list, loading: false})
        })
    })
  }

  handleActions = (song) => {
    console.log('action');
    AsyncStorage.getItem('playlists', (err, res) => {
      let playlists = null
      playlists = JSON.parse(playlists)
      if(!playlists){
        playlists = {}
        playlists['test'] = []
      }
      playlists['test'].push(song)
      console.log(playlists);
      AsyncStorage.setItem('playlists', JSON.stringify(playlists))
    })
  }

  render() {
    let { list, searchList } = this.state
    // console.log(searchList);
    list = searchList.length > 0 ? searchList : list
    return(
      <View>
        {
          list && list.map((song,index) => (
            <ListView key={song.title + index} thumbnail={song.thumbnail} title={song.title} song={song} handleActions={this.handleActions}/>
          ))
        }
      </View>
    )
  }
}

export default Songs
