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

class PopupModal extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render() {
    const{active, closeModal} = this.props
    return(
      <Modal isVisible={active} onBackButtonPress={()=> closeModal()} useNativeDriver	={true}>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <View style={{backgroundColor: '#fff', height: 180, width: 200}}>
          <Text>I am the modal content!</Text>
         </View>
       </View>
     </Modal>
    )
  }
}
export default PopupModal

const styles = StyleSheet.create({

})
