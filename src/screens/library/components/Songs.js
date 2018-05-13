import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  ScrollView
} from 'react-native'
// import { getTrending } from './../../../common/helpers'
import { ListView } from './../../../common/ListView'
import PopupModal from './../../../common/PopupModal'
import { Search } from './../../../common/Search'


class Songs extends Component{
  constructor(props){
    super(props)
    this.state = {
      list:[],
      searchList: [],
      popupModal: false,
      searchTerm: '',
    }
  }

  componentWillMount() {
    this.getSongs()
  }

  openModal = (song) => {
    this.setState({popupModal: true, selectedSong: song})
  }

  closeModal = () => {
    this.setState({popupModal: false})
  }

  getSongs(){
    AsyncStorage.getItem('library', (err, res) => {
      if(res)
        this.setState({list: JSON.parse(res), loading: false})
    })
  }

  handleSearch = (text) => {
    let { list } = this.state
    this.setState({searchTerm: text})
    let searchList = list.filter(song => song.title.toLowerCase().includes(text.toLowerCase()))
    this.setState({searchList})
  }

  playSong = (song) => {
    console.log(this.props);
    this.props.navigation.navigate('Player', {song})
  }

  render() {
    let { list, searchList, popupModal, selectedSong, searchTerm } = this.state
    console.log(this.props);
    list = searchTerm? searchList : list
    return(
      <View>
        <Search
          searchTerm={searchTerm}
          handleSearch={this.handleSearch}
        />
      <ScrollView>
        {
          list && list.map((song,index) => (
            <ListView
              key={song.title + index}
              thumbnail={song.thumbnail}
              title={song.title}
              song={song}
              openModal={this.openModal}
              playSong={this.playSong}
            />
          ))
        }
      </ScrollView>

        <PopupModal active={popupModal} closeModal={this.closeModal} song={selectedSong}/>
      </View>
    )
  }
}

export default Songs
