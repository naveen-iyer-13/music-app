import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient';
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
      onBackButtonPress={() => closeModal()}
      onStartShouldSetResponder={() => {
         return closeModal();
       }}
      onBackdropPress = {() => closeModal()}>
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
          <KeyboardAvoidingView style={styles.addPlaylist} behavior="position" enabled>
            <View style={{alignItems: 'center', height: 150, alignItems:'center', justifyContent :'center'}}>
              <Text style={styles.playlistHeading}>Rename the Playlist</Text>
              <Text style={styles.subheading}>Enter the name for this Playlist</Text>
              <TextInput style={styles.playlistInput}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => this.setState({newPlaylistName: text})}
             />
            </View>
            <LinearGradient colors={['#7AFFA0', '#62D8FF']} style={{display: 'flex', flexDirection: 'row',alignItems: 'center', height: 50, borderRadius: 8}}>
            <TouchableOpacity style={styles.optionOverview} onPress={() => this.setState({renameModalOpen: false})}>
              <Text style={styles.optionButton}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionOverview2} onPress={() => newPlaylistName ? this.handleRename() : {}}>
              <Text style={styles.optionButton}>RENAME</Text>
            </TouchableOpacity>
            </LinearGradient>
          </KeyboardAvoidingView>
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
    //fontFamily: '',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
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
    //fontFamily: '',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    fontSize: 18,
    marginBottom: 10,
    color: '#1C1C1C'
  },
  subheading: {
    //fontFamily: '',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
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
    paddingLeft: 5,
    //fontFamily: '',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
  },
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
  optionButton: {
    //fontFamily: '',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'transparent'
  },
  optionButtonCreate: {
    //fontFamily: '',
    fontFamily :Platform.OS === 'android' ? 'Proxima-Nova' : "Proxima Nova",
    fontSize: 16,
    color: '#6DEAD3',
  },
})
