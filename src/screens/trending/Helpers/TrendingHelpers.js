import { AsyncStorage } from 'react-native';
import axios from 'axios'
export const getTrendingSongs = (callback) => {
	axios.get('http://bibimpop.co/top100')
	.then(response => {
		callback(response.data)
	})
	.catch(error => console.log('get trending songs', error))
}
