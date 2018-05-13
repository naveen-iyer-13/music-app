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
} from 'react-native'
import Modal from "react-native-modal";
import { removeFromPlaylist } from './helpers'
let { width, height } = Dimensions.get('window')


class PlayerModal extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render() {
    const { active, closeModal, song, navigation, navigateToScreen, viewPlaylists, playlistNames, showPlaylists } = this.props
    return(
      <Modal
        isVisible={active}
        onBackButtonPress={() => closeModal()}>
        <View style={styles.modalOverlay}>
         <View style={styles.modalView}>
        {
          viewPlaylists
          ?
          <View>  
               {
                 playlistNames && playlistNames.map(name => {
                   return(
                     <TouchableOpacity style={styles.selectView} onPress={() => removeFromPlaylist(name, song, (res) => closeModal())}>
                       <Text style={styles.TextStyle}>{name}</Text>
                     </TouchableOpacity>
                   )
                 })
               }
          </View>
          :
          <View>
           <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Library', song)}>
             <Image source={require('../images/cancel.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
             <Text style={styles.TextStyle}>Remove from Library</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView} onPress={() => showPlaylists()}>
           <Image source={require('../images/remove-from-playlist.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Remove from playlist</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView}>
           <Image source={require('../images/wrong-song.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Wrong song?</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView} onPress={() => navigateToScreen('Search')} >
           <Image source={require('../images/search-artist.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Search Artist</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
           <Image source={require('../images/cancel.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Cancel</Text>
           </TouchableOpacity>

         </View>
        }
         <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
             <Image source={require('.././images/cancel.png')} style={{resizeMode: 'contain', height: 12, width: 12, marginLeft: 20}}/>
             <Text style={styles.TextStyle}>Cancel</Text>
             </TouchableOpacity>
         </View>
        </View>
       </Modal>
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
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 14
  }
})
