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
  Modal
} from 'react-native'
let { width, height } = Dimensions.get('window')

class PopupModal extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render() {
    const{active, closeModal} = this.props
    return(
      <Modal
      animationType="slide"
      transparent
      onRequestClose={() => closeModal()}
      visible={active}>
        <View style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: '#000', opacity: 0.8, justifyContent: 'center'}}>
        <View style={{height: 150, width: Dimensions.get('window').width, backgroundColor: '#F2F2F2'}}>
         <Text>Hello World!</Text>
        </View>
        </View>
      </Modal>
    )
  }
}
export default PopupModal

const styles = StyleSheet.create({

})
