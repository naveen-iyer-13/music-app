import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

const ListView = props => {
  const {image, title, artist} = props
	return(
		<View style={{borderBottomWidth: 2, height: 70, width: Dimensions.get('window').width, flexDirection: 'row', borderColor: '#D8D8D8', alignItems: 'center'}}>
     <TouchableOpacity>
       <Image
         style={{resizeMode: 'contain',height: 50, width: 50, marginLeft: 15, marginRight: 10}}
         source={{uri: props.picture}}
       />
     </TouchableOpacity>
     <View style={{width: '70%'}}>
       <Text>{props.title}</Text>
       <Text>{props.artist}</Text>
     </View>
     <TouchableOpacity style={{flexDirection: 'row'}}>
      <View style={{width: 5, height: 5, backgroundColor: '#000',marginRight: 3, borderRadius: 5}}/>
      <View style={{width: 5, height: 5, backgroundColor: '#000',marginRight: 3, borderRadius: 5}}/>
      <View style={{width: 5, height: 5, backgroundColor: '#000',marginRight: 3, borderRadius: 5}}/>
     </TouchableOpacity>
    </View>
	)
}
export default ListView
const styles = StyleSheet.create({})
