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
		<View style={{borderBottomWidth: 2, height: 70, width: Dimensions.get('window').width, flexDirection: 'row', borderColor: '#D8D8D8', alignItems: 'center'}}>
     <TouchableOpacity>
       <Image
         style={{resizeMode: 'contain',height: 50, width: 50, marginLeft: 15, marginRight: 10}}
         source={{uri: thumbnail ? thumbnail : ''}}
       />
     </TouchableOpacity>
     <View style={{width: '70%'}}>
       <Text>{title ? title : ''}</Text>
       <Text>{artist ? artist : ''}</Text>
     </View>
     <TouchableOpacity style={{flexDirection: 'row', height: 70, alignItems: 'center'}} onPress = {()=> openModal()}>
      <View style={{width: 5, height: 5, backgroundColor: '#000',marginRight: 3, borderRadius: 5}}/>
      <View style={{width: 5, height: 5, backgroundColor: '#000',marginRight: 3, borderRadius: 5}}/>
      <View style={{width: 5, height: 5, backgroundColor: '#000',marginRight: 3, borderRadius: 5}}/>
     </TouchableOpacity>
    </View>
	)
}

const styles = StyleSheet.create({})
