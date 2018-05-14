import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import Modal from 'react-native-modal'

class RemovePlaylist extends Component{
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    const { closeModal, active } = this.props
    return(
      <Modal
        isVisible={active}
        onBackButtonPress={() => closeModal()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Remove')}>
              <Image source={require('../../../images/cancel.png')} style={{resizeMode: 'contain', height: 20, width: 20, marginLeft: 15}}/>
              <Text style={styles.TextStyle}>Remove Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
              <Image source={require('../../../images/cancel.png')} style={{resizeMode: 'contain', height: 12, width: 12, marginLeft: 20}}/>
              <Text style={styles.TextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

export default RemovePlaylist

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
