import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native'
import Modal from 'react-native-modal'

class RemovePlaylist extends Component{
  constructor(props){
    super(props)
    this.state = {
      newPlaylistName: '',
      renameModalOpen: false
    }
  }

  handleRename = () => {
    this.setState({renameModalOpen: false})
    this.props.closeModal('Rename', this.state.newPlaylistName)
  }

  render() {
    const { closeModal, active } = this.props
    const { newPlaylistName } = this.state
    return(
      <Modal
        isVisible={active}
        onBackdropPress = {() => closeModal()}
        onBackButtonPress={() => closeModal()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.selectView} onPress={() => this.setState({renameModalOpen: true})}>
              <Image source={require('../../../images/box_edit.png')} style={{resizeMode: 'contain', height: 15, width: 15, marginLeft: 15}}/>
              <Text style={styles.TextStyle}>Rename Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectView} onPress={() => closeModal('Remove')}>
              <Image source={require('../../../images/cancel.png')} style={{resizeMode: 'contain', height: 12, width: 12, marginLeft: 15}}/>
              <Text style={styles.TextStyle}>Remove Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelView} onPress={() => closeModal()}>
              <Image source={require('../../../images/cancel.png')} style={{resizeMode: 'contain', height: 12, width: 12, marginLeft: 20}}/>
              <Text style={styles.TextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={this.state.renameModalOpen} onBackButtonPress={() => this.setState({renameModalOpen: false})}>
          <View style={styles.addPlaylist}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.playlistHeading}>Rename the Playlist</Text>
              <Text style={styles.subheading}>Enter the name for this Playlist</Text>
              <TextInput style={styles.playlistInput}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => this.setState({newPlaylistName: text})}
             />
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity style={styles.optionOverview} onPress={() => this.setState({renameModalOpen: false})}>
                <Text style={styles.optionButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionOverview} onPress={() => newPlaylistName ? this.handleRename() : {}}>
                <Text style={styles.optionButtonCreate}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontFamily: 'Proxima-Nova',
    fontSize: 14
  },
  addPlaylist: {
    backgroundColor: 'white',
    height: 200,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center'
  },
  playlistHeading: {
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#1C1C1C'
  },
  subheading: {
    fontFamily: 'Proxima-Nova',
    fontSize: 16,
    marginBottom: 10,
    color: '#919191'
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
  optionOverview: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
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
})
