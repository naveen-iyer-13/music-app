import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
  ScrollView
} from 'react-native'
import {getTrendingSongs} from './Helpers/TrendingHelpers'
import Footer from '../../common/Footer'
export default class Trending extends Component {

  constructor (props) {
    super(props);
    this.state = {
      trendingSongs: [],
      randomArray: []
    }
  }

  componentDidMount() {
    this.getSongs()
    this.randomNumber()
  }

  getSongs(){
    getTrendingSongs((trendingSongs) => {this.setState({trendingSongs: trendingSongs})})
  }

  randomNumber(){
    var random;
    var array = []
    for(var i = 0 ; i < 10 ; i++){
      random = Math.floor(Math.random()*101);
      array.push(random)
    }
    this.setState({randomArray: array})
  }

  render () {
    var trending = this.state.trendingSongs
    var ListView = <View />
    var artistView = <View />
    if(trending.length > 0){
      ListView = trending.map((item, index)=> {
        return (
          <View key={index}>
           <Text>{item.title}</Text>
           <Text>{item.title}</Text>
          </View>
        );
      })
      artistView = this.state.randomArray.map((item, index)=>{
        trending.map((itemChild , indexChild)=> {
         if(indexChild == item){
           return (
             <View key={indexChild}>
              <Text>{itemChild.title}</Text>
             </View>
           );
         }
        })
      })
    }

    return (
      <View style={styles.container}>
       <View style={styles.topView}>
         
       </View>
       <ScrollView>
        <Text>TODAY{"'"}S TOP 100 SONGS</Text>
        {ListView}
       </ScrollView>
       <Footer />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:undefined,
    width: undefined,
    backgroundColor: '#FFFFFF',
  },
  topView: {
    height: 175,
    borderTopWidth: 4,
    borderBottomWidth: 1
  },
});
