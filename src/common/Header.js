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
    const { handleBackButton, handleKeyPress, header, tab } = this.props
    // console.log(this.props);
    return(
      <View style={styles.container}>
        {
          header !== 'Library'
          ?
          <TouchableOpacity onPress={() => handleBackButton()}>
            <Text style={styles.backArrow}>{'<'}</Text>
          </TouchableOpacity>
          :
          <View style={{width: 20}}/>
        }
        <Text style={styles.heading}>{header}</Text>
        {
          tab !== 'songs' && <TouchableOpacity onPress={() => handleKeyPress()}>
            <Text style={styles.plus}>{header === 'Library' ? '+' : '...'}</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
}

export default Header

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flexDirection: 'row',
    height: 45,
    alignItems:'center'
  },
  backArrow: {
    fontSize: 25,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A',
  },
  plus: {
    fontSize: 25,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A',
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A',
    width: '90%',
    textAlign: 'center'
  }
})
