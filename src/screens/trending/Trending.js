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
import ListView from '../../common/ListView'
import SplashScreen from '../../common/SplashScreen'
export default class Trending extends Component {

  constructor (props) {
    super(props);
    this.state = {
      trendingSongs: [],
      randomArray: [],
      loading: true
    }
  }

  componentDidMount() {
    this.getSongs()
    this.randomNumber()
  }

  getSongs(){

    getTrendingSongs((trendingSongs) => {
      this.setState({trendingSongs: trendingSongs, loading: false})
    })
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
    console.log(this.state)
    var trending = this.state.trendingSongs
    var List = <View />
    var artistView = <View />
    if(trending.length > 0){
      List = trending.map((item, index)=> {
        return (
           <ListView title={item.title} artist={item.artist} thumnail={item.cover}  key={index}/>
        );
      })
       artistView= trending.map((item, index)=> {
        if(this.state.randomArray.includes(index)){
          return(
            <View key={index} style={{paddingLeft: 15, paddingTop: 25, width: 100}}>
              <Image
                style={{resizeMode: 'contain',height: 80, width: 80, borderRadius: 80}}
                source={{uri: item.cover}}
              />
              <Text style={{textAlign: 'center'}}>{item.artist}</Text>
            </View>
          )
        }
      })
    }
    if(this.state.loading){
      return (
        <SplashScreen />
      )
    }
    else {
      return (
        <View style={styles.container}>
         <View style={{height: 190, alignItems: 'center'}}>
          <Text style={{paddingTop: 20, fontFamily: 'Proxima-Nova'}}>Trending artist</Text>
           <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{width: this.state.datesLength*90}} showsHorizontalScrollIndicator={false}>
            {artistView}
           </ScrollView>
         </View>
         <Text style={{textAlign: 'center', width: '100%', marginBottom: 10, fontFamily: 'Proxima-Nova'}}>TODAY{"'"}S TOP 100 SONGS</Text>
         <ScrollView>
          {List}
         </ScrollView>
         <Footer />
        </View>
      )
    }
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
