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
    const{active} = this.props
    return(
      <Modal>
      </Modal>
    )
  }
}
export default PopupModal

const styles = StyleSheet.create({

})
