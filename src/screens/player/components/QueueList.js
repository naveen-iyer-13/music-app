import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, Dimensions, AsyncStorage, Modal, ScrollView } from 'react-native';

class QueueList extends Component {
	render() {
		const { handleQueue, trackList, closeModal } = this.props
		console.log(trackList)
		return (
			<View style={styles.container}>
				<View style={{flexDirection: 'row', marginBottom: 10}}>
					<View style={{ width: '85%'}}>
					<Text style={{color: '#FFFFFF', alignSelf: 'center', fontSize: 17}}>UP NEXT</Text>
					</View>
					 <TouchableOpacity onPress={() => closeModal()}>
					<Image source={require('../../../images/white-close.png')} style={{width: 16, height: 16, alignSelf: 'flex-end'}} />
					</TouchableOpacity>
				</View>
				<ScrollView>
				{
					trackList && trackList.map((track, i) => {
						return(
							<View style={styles.rowItem}>
							     <TouchableOpacity>
							       <Image
							         style={styles.imageView}
							         source={track.thumbnail ? {uri: track.thumbnail} : require('../../../images/default-icon.png')}
							       />
							     </TouchableOpacity>
							     <TouchableOpacity style={{width: '70%', paddingLeft: 20}} onPress={() => handleQueue(i)}>
							       <Text style={styles.titleText}>{track.title ? track.title : ''}</Text>
							       <Text style={styles.artistText}>{track.artist ? track.artist : ''}</Text>
							     </TouchableOpacity>
						     
							</View>
						)
					})
				}
				</ScrollView>

			</View>
		)
	}
}

export default QueueList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    borderColor: '#D8D8D8',
    alignItems: 'center',
    backgroundColor: '#000000',
    opacity: 0.7,
    padding: 20
  },
  rowItem: {
  	height: 80,
  	width: Dimensions.get('window').width,
    borderColor: '#D8D8D8',
    flexDirection: 'row'
  },
  imageView: {
    resizeMode: 'contain',
    height: 65,
    width: 65,
    marginLeft: 5,
    marginRight: 10
  },
  titleText: {
  	paddingTop: 5,
    fontFamily: 'Proxima-Nova-Bold',
    fontSize: 16,
    color: '#FFFFFF',
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
