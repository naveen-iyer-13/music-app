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
  const { thumbnail, title, artist, song, openModal, openPlaylist, playSong, len, index, onError, fetchFailed, showDefault } = props
	return(
		<View style={styles.container}>
     <TouchableOpacity>
       <Image
         style={styles.imageView}
         onError={() => onError(song.bp_id)}
         source={ showDefault || fetchFailed.includes(song.bp_id) ? require('./../images/default-icon.png') :  {uri: thumbnail}}
       />
     </TouchableOpacity>
     <TouchableOpacity style={{width: '70%'}} onPress={() => playSong ? playSong(index, title) : openPlaylist(song, title)}>
       <Text style={styles.titleText}>{title ? title : ''}</Text>
       <Text style={styles.artistText}>{artist ? artist : ''}</Text>
       <Text style={styles.artistText}>{len ? `${len} songs` : ''}</Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.breadCumsLayout} onPress = {() => openModal ? openModal(song, title) : {}}>
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
    //fontFamily: '',
    fontSize: 16,
    color: '#252525',
    paddingBottom: 5,
    flexWrap: 'wrap'
  },
  artistText: {
    //fontFamily: '',
    fontSize: 14,
    color: '#252525',
    opacity: 0.5,
    flexWrap: 'wrap'
  },
  breadCumsLayout: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center'
  },
  breadCums:{
    width: 5,
    height: 5,
    backgroundColor: '#D8D8D8',
    marginRight: 3,
    borderRadius: 5,
  }
})
