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
  ScrollView,
} from 'react-native'
import { getTrending } from './../../common/helpers'
import Footer from '../../common/Footer'
import {ListView} from '../../common/ListView'
import SplashScreen from '../../common/SplashScreen'

class Trending extends Component {

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
    AsyncStorage.getItem('trendingSongs', (err, res) => {
      if(res)
        this.setState({trendingSongs: JSON.parse(res), loading: false})
      else
        getTrending((trendingSongs) => {
          this.setState({trendingSongs, loading: false})
        })
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
    var trending = this.state.trendingSongs
    var List = <View />
    var artistView = <View />
    if(trending.length > 0){
      List = trending.map((item, index)=> {
        return (
           <ListView title={item.title} artist={item.artist} thumbnail={item.cover}  key={index}/>
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
         <Footer screenName={'Trending'} navigation={this.props.navigation} />
        </View>
      )
    }
  }
}

export default Trending;

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
