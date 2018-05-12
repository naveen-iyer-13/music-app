import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native'

export const ListView = ({thumbnail, title}) => (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.thumbnail} source={{uri: thumbnail}}/>
      </View>
      <View style={styles.songInfo}>
        <Text>
          {title}
        </Text>
      </View>
      <View style={styles.actionBtn}></View>
    </View>
)

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  imageContainer:{
    width: 50,
    height: 50
  },
  thumbnail:{
    width: '100%',
    height: '100%'
  },
  actionBtn:{
    display: 'flex',
    flexDirection: 'column'
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
