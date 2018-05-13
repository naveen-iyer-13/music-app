import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

export const ListView = props => {
  const {thumbnail, title, artist, song, openModal} = props
	return(
		<View style={styles.container}>
     <TouchableOpacity>
       <Image
         style={styles.imageView}
         source={{uri: thumbnail ? thumbnail : ''}}
       />
     </TouchableOpacity>
     <View style={{width: '70%'}}>
       <Text style={styles.titleText}>{title ? title : ''}</Text>
       <Text style={styles.artistText}>{artist ? artist : ''}</Text>
     </View>
     <TouchableOpacity style={styles.breadCumsLayout} onPress = {()=> openModal(song)}>
      <View style={styles.breadCums}/>
      <View style={styles.breadCums}/>
      <View style={styles.breadCums}/>
     </TouchableOpacity>
    </View>
	)
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    borderColor: '#D8D8D8',
    alignItems: 'center'
  },
  imageView: {
    resizeMode: 'contain',
    height: 50,
    width: 50,
    marginLeft: 15,
    marginRight: 10
  },
  titleText: {
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 12,
    color: '#4A4A4A',
    paddingBottom: 5
  },
  artistText: {
    fontFamily: 'Proxima-Nova',
    fontSize: 12,
    color: '#D8D8D8'
  },
  breadCumsLayout: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center'
  },
  breadCums:{
    width: 5,
    height: 5,
    backgroundColor: '#000',
    marginRight: 3,
    borderRadius: 5
  }
})
