import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      valid: false,
      ingredients: []
    };
    this.addIngredient = this.addIngredient.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);
  }
  addIngredient = () => {
    //this.setState({ingredients: this.state.ingredients + this.state.text})
    var newIngredient = this.state.ingredients.slice();
    
    this.state.ingredients.push(this.state.text);
    this._textInput.setNativeProps({text: ''});
    this.state.text = "";
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //   if (this.readyState == 4 && this.status == 200) {
    //     if (this.state.text === 'fuck') {
    //       this.setState({valid: true});
    //     }
    //   }
    // };
    // xhttp.open("POST", "https://cook-my-fridge.herokuapp.com:5000/getRecipes/"+this.state.text, true);
    // xhttp.send();
  }

  submitIngredients = () => {
    fetch('https://cook-my-fridge.herokuapp.com/getRecipes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: this.state.ingredients,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({valid: true});
      this.setState({text: responseJson[0].name})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const DisplayCurrIngredients = () => {
      /*var retv = new Array();
      for (var item in this.state.ingredients){
        retv = retv.concat(<Text>{item}</Text>);
      }
      return retv;*/
      return (<View>{ this.state.ingredients.map((item, key)=>(
        <Text> { item } </Text>)
        )}</View>);
      //return "<Text>{this.state.text}</Text>";
    }
    return (
      <View style={styles.container}>
        <View style= {{flex:2}}>
          <Text style={styles.title}>Cook My Fridge</Text>
          <Text>Made for people who can't cook.</Text>
        </View>
        <View style={{flex: 1, padding: 30}}>
          <TextInput
            ref={component => this._textInput = component}
            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 300, padding: 10}}
            placeholder="Add Ingredient"
            onChangeText={(text) => this.setState({text})}
          />
          <Button
            onPress={this.addIngredient}
            title="Add Ingredient"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <View style = {{flex:4}}>
          <DisplayCurrIngredients/>
        </View>
        <View style = {{flex:1}}>
          <Button
            onPress={this.submitIngredients}
            title="Go"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            style={{position: 'absolute', bottom: 0, zIndex: 100}}
          />
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },

});
