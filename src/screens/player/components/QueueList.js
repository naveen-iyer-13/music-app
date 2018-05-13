import React, { Component } from 'react'

class QueueLsit extends Component {
	render() {
		const { handleQueue, trackList } = this.props
		return (
			<View style={styles.container}>
				{
					trackList && trackList.map((track, i) => 
						<View>
						     <TouchableOpacity>
						       <Image
						         style={styles.imageView}
						         source={track.thumbnail ? {uri: track.thumbnail} : require('./../images/default-icon.png')}
						       />
						     </TouchableOpacity>
						     <TouchableOpacity style={{width: '70%'}} onPress={() => handleQueue(i)}>
						       <Text style={styles.titleText}>{track.title ? track.title : ''}</Text>
						       <Text style={styles.artistText}>{track.artist ? track.artist : ''}</Text>
						     </TouchableOpacity>
						     
						</View>
					)
				}
			</View>
		)
	}
}

export default QueueList

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
