import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

class Header extends Component{
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    const { handleBackButton, handleKeyPress, header } = this.props
    // console.log(this.props);
    return(
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => handleBackButton()}>
          <Text>go back</Text>
        </TouchableOpacity>
        <Text>{header}</Text>
        <TouchableOpacity onPress={() => handleKeyPress()}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Header

const styles = StyleSheet.create({
  container:{

  }
})
