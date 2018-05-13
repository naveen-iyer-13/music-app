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
let { width, height } = Dimensions.get('window')

class PlayerModal extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render() {
    const { active, closeModal, song } = this.props
    return(
      <Modal
        isVisible={active}
        onBackButtonPress={() => closeModal()}>
        <View style={styles.modalOverlay}>
         <View style={styles.modalView}>
           <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Library', song)}>
             <Image source={require('.././images/white-close.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
             <Text style={styles.TextStyle}>Add to Library</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView}>
           <Image source={require('.././images/top100.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Add to playlist</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView}>
           <Image source={require('.././images/top100.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Play Next</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView}>
           <Image source={require('.././images/top100.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Add to Queue</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Search', song)}>
           <Image source={require('.././images/top100.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
           <Text style={styles.TextStyle}>Search Artist</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
           <Image source={require('.././images/top100.png')} style={{resizeMode: 'contain', height: 25, width: 25, marginLeft: 15}}/>
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
    height: 300
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
