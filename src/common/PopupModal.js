
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  AlertIOS,
  TextInput,
  ScrollView,
  AsyncStorage
} from 'react-native'
import Modal from "react-native-modal";
let { width, height } = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient';
class PopupModal extends Component{
  constructor(props){
    super(props)
    this.state = {
      newPlaylistName: '',
      addSong: true,
      librarySongs: []
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('library', (err, res) => {
      if(res){
        res = JSON.parse(res)
        this.setState({librarySongs: res})
      }
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({addSong: true})
    if(nextProps.song){
      AsyncStorage.getItem('library', (err, res) => {
        if(res){
          res = JSON.parse(res)
          this.setState({librarySongs: res})
          for(let i = 0; i < res.length; i++){
            if(res[i].bp_id === nextProps.song.bp_id){
              this.setState({addSong: false})
              break;
            }
          }
        }
      })
    }
  }

  render() {
    const { active, closeModal, song, openPlaylist, playlistName, addToPlaylist, createPlaylist, addPlaylistModal, onlyModal, isPlaylistPage } = this.props
    const { newPlaylistName, addSong } = this.state
    console.log(this.state, this.props);
    return(
      <Modal
        isVisible={active}
        onBackButtonPress={() => closeModal()}
        onBackdropPress = {() => closeModal()}>
        <View style={{flex: 1, justifyContent: addPlaylistModal ? 'center' : 'flex-end'}}>
         {
          addPlaylistModal  ?
           <View style={styles.addPlaylist}>
             <View style={{alignItems: 'center', height: 150, alignItems:'center', justifyContent :'center'}}>
               <Text style={styles.playlistHeading}>Create a new Playlist</Text>
               <Text style={styles.subheading}>Enter the name for this Playlist</Text>
               <TextInput style={styles.playlistInput}
                 underlineColorAndroid={'transparent'}
                 onChangeText={(text) => this.setState({newPlaylistName: text})}
              />
             </View>
             <LinearGradient colors={['#7AFFA0', '#62D8FF']} style={{display: 'flex', flexDirection: 'row', backgroundColor:'#000', alignItems: 'center', height: 50, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
               <TouchableOpacity style={styles.optionOverview} onPress={() => closeModal('Cancel Create')}>
                 <Text style={styles.optionButton}>CANCEL</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.optionOverview2} onPress={() => newPlaylistName ? closeModal('Create', newPlaylistName) : {}}>
                 <Text style={styles.optionButtonCreate}>CREATE</Text>
               </TouchableOpacity>
             </LinearGradient>
           </View>
            :
            onlyModal ?
               <View />
               :
               <View style={styles.modalView}>
                 {
                   !openPlaylist ? <View>
                     <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Library', song, addSong ? 'add' : 'remove')}>
                       {addSong ? <Image source={require('.././images/library.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/> :
                                  <Image source={require('.././images/library-active.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>}
                       <Text style={styles.TextStyle}>{addSong ? 'Add to Library' : 'Remove from Library'}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Playlists', song, isPlaylistPage ? 'remove' : 'add')}>
                     {isPlaylistPage ? <Image source={require('.././images/add-to-playlist.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/> :
                                       <Image source={require('.././images/remove-from-playlist.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>}
                     <Text style={styles.TextStyle}>{isPlaylistPage? 'Remove from playlist' : 'Add to playlist'}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.selectView}>
                     <Image source={require('.././images/add-to-queue.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
                     <Text style={styles.TextStyle}>Play Next</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.selectView}>
                     <Image source={require('.././images/add-to-queue.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
                     <Text style={styles.TextStyle}>Add to Queue</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Search', song)}>
                     <Image source={require('.././images/search.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
                     <Text style={styles.TextStyle}>Search Artist</Text>
                     </TouchableOpacity>
                   </View>
                   :
                   <View style={{height: 250}}>
                    <LinearGradient colors={['#7AFFA0', '#62D8FF']} style={{width: '60%', height: 40,alignItems:'center',
                       marginLeft: '20%',marginTop: 15, justifyContent: 'center', borderRadius: 10, backgroundColor: '#f4f4f4', marginBottom: 15}}>
                       <TouchableOpacity onPress={() => createPlaylist()}>
                         <Text style={{fontSize: 16, color: '#4A4A4A'}}>New Playlist</Text>
                       </TouchableOpacity>
                     </LinearGradient>
                     <ScrollView>
                       {
                         playlistName && playlistName.map((name, index) => {
                           return(
                             <TouchableOpacity key={name+index} style={styles.selectView} onPress={() => addToPlaylist(name)} style={{marginLeft: 10}}>
                               <Text style={styles.TextStylePlaylist}>{name}</Text>
                             </TouchableOpacity>
                           )
                         })
                       }
                     </ScrollView>
                   </View>
             }
             <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
             <Image source={require('.././images/cancel.png')} style={styles.closeIcon}/>
             <Text style={styles.TextStyle}>Cancel</Text>
             </TouchableOpacity>
           </View>
         }
        </View>
       </Modal>
    )
  }
}
export default PopupModal

const styles = StyleSheet.create({
  optionOverview: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#FFFFFF',
    height: 50,
    justifyContent:'center'
  },
  optionOverview2: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    height: 50,
    justifyContent:'center'
  },
  subheading: {
    //fontFamily: '',
    fontSize: 16,
    marginBottom: 10,
    color: '#919191'
  },
  optionButton: {
    //fontFamily: '',
    fontSize: 16,
    color: '#FFFFFF'
  },
  optionButtonCreate: {
    //fontFamily: '',
    fontSize: 16,
    color: '#FFFFFF',
  },
  playlistInput: {
    width: 300,
    height: 40,
    backgroundColor: '#F7F7F7',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    //fontFamily: ''
  },
  playlistHeading: {
    //fontFamily: '',
    fontSize: 18,
    marginBottom: 10,
    color: '#1C1C1C'
  },
  addPlaylist: {
    backgroundColor: 'white',
    height: 200,
    borderRadius: 8,
    display: 'flex',
  },
  closeIcon: {
    resizeMode: 'contain',
    height: 10,
    width: 10,
    marginLeft: 20,
    marginRight: 5
  },
  icons:{
    resizeMode: 'contain',
    height: 20,
    width: 20,
    marginLeft: 15
  },
  createPlaylist:{
     width: '50%',
     height: 35,
     alignItems:'center',
     marginLeft: '25%',
     marginTop: 15,
     justifyContent: 'center',
     borderRadius: 10,
     backgroundColor: '#f4f4f4',
     marginBottom: 15
   },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    maxHeight: 300
  },
  selectView: {
    height: 50,
    flexDirection: 'row',
    alignItems:'center'
  },
  cancelView: {
    height: 50,
    borderTopWidth: 1,
    borderColor: '#D8D8D8',
    flexDirection: 'row',
    alignItems:'center'
  },
  TextStyle: {
    paddingLeft: 15,
    color: '#2B2B2B',
    //fontFamily: '',
    fontSize: 15,
  },
  TextStylePlaylist:{
    paddingLeft: 15,
    color: '#2B2B2B',
    //fontFamily: '',
    fontSize: 17,
    marginBottom: 7
  },
  PlayTextStyle:{
    paddingLeft: 15,
    color: '#2B2B2B',
    //fontFamily: '',
    fontSize: 15,
    margin: 5
  }
})
