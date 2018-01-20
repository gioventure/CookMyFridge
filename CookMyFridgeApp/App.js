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
    var arr = ['test', 'shit'];
    fetch('https://cook-my-fridge.herokuapp.com/getRecipes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: arr,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({valid: true});
      this.setState({text: responseJson.name})
    })
    .catch((error) => {
      console.error(error);
    });
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
      this.setState({valid: true});
      this.setState({text: responseJson.name})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const Test = () => {
      if (this.state.valid === true) {
        return (
          <Text>{this.state.text}</Text>
        );
      }
      else {
        return null;
      }
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cook My Fridge</Text>
        <Text>Made for people who can't cook.</Text>
        <View style={{padding: 30}}>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 300, padding: 10}}
            placeholder="Search..."
            onChangeText={(text) => this.setState({text})}
          />
          <Button
            onPress={this.addIngredient}
            title="Search"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={this.submitIngredients}
            title="Go"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            style={{position: 'absolute', bottom: 0, zIndex: 100}}
          />
          <Test/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },

});
