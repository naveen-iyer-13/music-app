
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
  ScrollView
} from 'react-native'
import Modal from "react-native-modal";
let { width, height } = Dimensions.get('window')

class PopupModal extends Component{
  constructor(props){
    super(props)
    this.state = {
      newPlaylistName: ''
    }
  }

  render() {
    const { active, closeModal, song, openPlaylist, playlistName, addToPlaylist, createPlaylist, addPlaylistModal, onlyModal } = this.props
    const { newPlaylistName } = this.state
    return(
      <Modal
        isVisible={active}
        onBackButtonPress={() => closeModal()}>
        <View style={{flex: 1, justifyContent: addPlaylistModal ? 'center' : 'flex-end'}}>
         {
          addPlaylistModal  ?
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
               <TouchableOpacity style={styles.optionOverview} onPress={() => closeModal('Cancel Create')}>
                 <Text style={styles.optionButton}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.optionOverview} onPress={() => newPlaylistName ? closeModal('Create', newPlaylistName) : {}}>
                 <Text style={styles.optionButtonCreate}>Create</Text>
               </TouchableOpacity>
             </View>
           </View>
            :
            onlyModal ?
               <View />
               :
               <View style={styles.modalView}>
                 {
                   !openPlaylist ? <View>
                     <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Library', song)}>
                       <Image source={require('.././images/library.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
                       <Text style={styles.TextStyle}>Add to Library</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Playlists', song)}>
                     <Image source={require('.././images/add-to-playlist.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}} />
                     <Text style={styles.TextStyle}>Add to playlist</Text>
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
                     <TouchableOpacity onPress={() => createPlaylist()} style={{width: '50%', height: 35,alignItems:'center',
                        marginLeft: '25%',marginTop: 15, justifyContent: 'center', borderRadius: 10, backgroundColor: '#f4f4f4', marginBottom: 15}}>
                       <Text style={{fontFamily: 'Proxima-Nova', fontSize: 14, color: '#4A4A4A'}}>New Playlist</Text>
                     </TouchableOpacity>
                     <ScrollView>
                       {
                         playlistName && playlistName.map(name => {
                           return(
                             <TouchableOpacity style={styles.selectView} onPress={() => addToPlaylist(name)} style={{marginLeft: 10}}>
                               <Text style={styles.TextStyle}>{name}</Text>
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
    height: 12,
    width: 12,
    marginLeft: 20
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
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 15,
  },
  PlayTextStyle:{
    paddingLeft: 15,
    color: '#2B2B2B',
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 15,
    margin: 5
  }
})
