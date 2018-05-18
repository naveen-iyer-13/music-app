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
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import { removeFromPlaylist, removeFromLibrary, ifInPlaylists, addToLibrary } from './helpers'
let { width, height } = Dimensions.get('window')


class PlayerModal extends Component{
  constructor(props){
    super(props)
    this.state = {
      newPlaylistName: ""
    }
  }

  render() {
    const { active, playlistName, createPlaylist, addNewPlaylist, addToPlaylist, closeModal, song, navigation, navigateToScreen, viewPlaylists, addPlaylistModal, showPlaylists, ifInLibrary, name, songs } = this.props
    return(
      <View>
      <Modal
        isVisible={active}
        onBackButtonPress={() => closeModal()}
        onBackdropPress = {() => closeModal()}>
          <View style={{flex: 1, justifyContent: addPlaylistModal ? 'center' : 'flex-end'}}>
         <View style={styles.modalView}>
        {
          viewPlaylists
          ?
           <View style={{height: 250}}>
                    <LinearGradient colors={['#7AFFA0', '#62D8FF']} style={{width: '60%', height: 40,alignItems:'center',
                       marginLeft: '20%',marginTop: 15, justifyContent: 'center', borderRadius: 10, backgroundColor: '#f4f4f4', marginBottom: 15}}>
                       <TouchableOpacity onPress={() => createPlaylist()}>
                         <Text style={{fontFamily: 'Proxima-Nova-Bold', fontSize: 16, color: '#4A4A4A'}}>New Playlist</Text>
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
          :
          addPlaylistModal  
            ?
           <View style={styles.addPlaylist}>
             <View style={{alignItems: 'center'}}>
               <Text style={styles.playlistHeading}>Create a new Playlist</Text>
               <Text style={styles.subheading}>Enter the name for this Playlist</Text>
               <TextInput style={styles.playlistInput}
                 underlineColorAndroid={'transparent'}
                 onChangeText={(text) => this.setState({newPlaylistName: text})}
              />
             </View>
             <View style={{display: 'flex', flexDirection: 'row'}}>
               <TouchableOpacity style={styles.optionOverview} onPress={() => closeModal('addPlaylist')}>
                 <Text style={styles.optionButton}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.optionOverview} onPress={() => this.state.newPlaylistName ? addNewPlaylist(playlistName, this.state.newPlaylistName) : {}}>
                 <Text style={styles.optionButtonCreate}>Create</Text>
               </TouchableOpacity>
             </View>
           </View>
           :
          <View>
          {
           //  <TouchableOpacity style={styles.selectView} onPress={() => ifInLibrary ?  removeFromLibrary(song, () => closeModal(ifInLibrary) ) : addToLibrary(songs, song, () => closeModal(ifInLibrary) ) }>
           //   <Image source={ ifInLibrary ? require('../images/cancel.png') : require('../images/nav-heart.png')} style={{resizeMode: 'contain', height: 15, width: 15, marginLeft: 20}}/>
           //   <Text style={styles.TextStyle}>{ ifInLibrary ? 'Remove from Library' : 'Add to Library'}</Text>
           // </TouchableOpacity>
          }
           
           <TouchableOpacity style={styles.selectView} onPress={() => showPlaylists()}>
           <Image source={require('../images/add-to-playlist.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Add to Playlist</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView}>
           <Image source={require('../images/wrong-song.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Wrong song?</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView} onPress={() => navigateToScreen('Search')} >
           <Image source={require('../images/search.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Search Artist</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
           <Image source={require('../images/cancel.png')} style={{resizeMode: 'contain', height: 10, width: 10, marginLeft: 20}}/>
           <Text style={styles.TextStyle}>Cancel</Text>
           </TouchableOpacity>

         </View>
        }
         </View>
        </View>
       </Modal>
       </View>
    )
  }
}
export default PlayerModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1 ,
    justifyContent: 'flex-end'
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 250
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
    paddingLeft: 10,
    color: '#4B4B4B',
    fontFamily: 'Proxima-Nova',
    fontSize: 14
  },
   optionOverview: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
  },
  subheading: {
    fontFamily: 'Proxima-Nova',
    fontSize: 16,
    marginBottom: 10,
    color: '#919191'
  },
  optionButton: {
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 16,
    color: '#F8001E'
  },
  optionButtonCreate: {
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 16,
    color: '#6DEAD3',
  },
  playlistInput: {
    width: 300,
    height: 40,
    backgroundColor: '#F7F7F7',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    fontFamily: 'Proxima-Nova'
  },
  playlistHeading: {
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#1C1C1C'
  },
  addPlaylist: {
    backgroundColor: 'white',
    height: 200,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center'
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
    fontFamily: 'Proxima-Nova',
    fontSize: 15,
  },
  TextStylePlaylist:{
    paddingLeft: 15,
    color: '#2B2B2B',
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 17,
    marginBottom: 7
  },
  PlayTextStyle:{
    paddingLeft: 15,
    color: '#2B2B2B',
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 15,
    margin: 5
  }
})
