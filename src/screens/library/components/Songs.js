import React, { Component } from 'react'
import {
  View,
  Text
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
    getTrending(res => {
      this.setState({list: res})
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.searchList){
      this.setState({searchList: nextProps.searchList})
    }
  }

  render() {
    let { list, searchList } = this.state
    list = searchList.length > 0 ? searchList : list
    return(
      <View>
        {
          list && list.map((song,index) => (
            <ListView key={song.title + index} thumbnail={song.thumbnail} title={song.title}/>
          ))
        }
      </View>
    )
  }
}

export default Songs
