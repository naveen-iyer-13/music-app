import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
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
          <View style={{width: '10%', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity onPress={() => handleBackButton()}>
          <Image
            style={{height: 30, width: 30}}
            source={require('./../images/arrow_back.png')}
          />
          </TouchableOpacity>
          </View>
          :
          <View style={{width: '10%'}}/>
        }
        <View style={{width: '80%', justifyContent:'center', alignItems:'center'}}>
        <Text style={styles.heading}>{header.toUpperCase()}</Text>
        </View>
        {
          tab !== 'songs' && <View style={{width: '10%', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity onPress={() => handleKeyPress()}>
            <Text style={styles.plus}>{header === 'Library' ? '+' : '...'}</Text>
          </TouchableOpacity>
          </View>
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
    alignItems:'center',
    width: Dimensions.get('window').width
  },
  backArrow: {
    fontSize: 25,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A',
  },
  plus: {
    fontSize: 25,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A'
  },
  heading: {
    fontSize: 16,
    fontFamily: 'Proxima-Nova-Bold',
    color: '#4A4A4A',
    width: '90%',
    textAlign: 'center'
  }
})
