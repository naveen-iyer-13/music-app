
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
        <View style={styles.modalOverlay}>
         {
          addPlaylistModal  ?
           <View style={{backgroundColor: 'white', height: 200, marginBottom: height / 3, borderRadius: 8, display: 'flex', justifyContent: 'center'}}>
             <View style={{alignItems: 'center'}}>
               <Text style={{fontFamily: 'Proxima-Nova-Bold', fontSize: 18, marginBottom: 10, color: '#000'}}>Create a new Playlist</Text>
               <Text style={{fontFamily: 'Proxima-Nova', fontSize: 16, marginBottom: 10, color: '#4A4A4A'}}>Enter the name for this Playlist</Text>
               <TextInput style={{width: 300, height: 40, backgroundColor: '#FFFFFF', borderColor: '#D8D8D8', borderWidth: 1, borderRadius: 10, marginBottom: 15}}
                 underlineColorAndroid={'transparent'}
                 onChangeText={(text) => this.setState({newPlaylistName: text})}
              />
             </View>
             <View style={{display: 'flex', flexDirection: 'row'}}>
               <TouchableOpacity style={{display: 'flex', flex: 1, alignItems: 'center'}} onPress={() => closeModal('Cancel Create')}>
                 <Text style={{fontFamily: 'Proxima-Nova-Bold', fontSize: 14, color: '#000'}}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{display: 'flex', flex: 1, alignItems: 'center'}} onPress={() => newPlaylistName ? closeModal('Create', newPlaylistName) : {}}>
                 <Text style={{fontFamily: 'Proxima-Nova-Bold', fontSize: 14, color: '#000'}}>Create</Text>
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
             <Image source={require('.././images/cancel.png')} style={{resizeMode: 'contain', height: 12, width: 12, marginLeft: 20}}/>
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
  modalOverlay: {
    flex: 1 ,
    justifyContent: 'flex-end'
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
    color: '#4B4B4B',
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 14
  }
})
