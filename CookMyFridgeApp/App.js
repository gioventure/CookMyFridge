import React from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { SearchBar, Icon, Badge, Button } from 'react-native-elements';
// import { Camera, Permissions } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      valid: false,
      ingredients: [],
    };
    this.addIngredient = this.addIngredient.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    //this.deleteIngredient = this.deleteIngredient.bind(this);
  }
  addIngredient = () => {
    //this.setState({ingredients: this.state.ingredients + this.state.text})
    var newIngredient = this.state.ingredients.slice();
    newIngredient.push(this.state.text);
    this.setState({
        ingredients: newIngredient,
        text: ""
    });
    //this._textInput.setNativeProps({text: ''});
  }
  deleteIngredient = (item) => {
    var newIngredient = this.state.ingredients;
    var getIndex = newIngredient.indexOf(item);

    newIngredient.splice(getIndex, 1);
    this.setState({
      ingredients: newIngredient
    });
  }
  clearSearch = () => {
    this.setState({
      text: ""
    });
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
      alert("hello" + JSON.stringify(responseJson));
      //this.setState({valid: true});
      //this.setState({text: responseJson[0].name})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const DisplayCurrIngredients = () => {
      return (
        <View>{ this.state.ingredients.map((item)=>(
          <View style={{marginTop: 5}}><Badge containerStyle={{ backgroundColor: '#60A65F', flexDirection: 'row'}}><Icon name='close' color='#FFFFFF' onPress={() => this.deleteIngredient(item)}/><Text style = {{color:'white'}}>{item}</Text></Badge></View>)
        )}
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style= {{flex:2, paddingTop:80}}>
          <Text style={styles.title}>Cook My Fridge</Text>
          <Text>Made for people who cannot cook.</Text>
        </View>
        <View style={{flex: 1, padding: 30}}>
        <SearchBar
          value={this.state.text}
          onChangeText={(text) => this.setState({text})}
          onClearText={this.clearSearch}
          placeholder='Enter an Ingredient...' />

          <Button
            onPress={this.addIngredient}
            title="Add Ingredient"
            backgroundColor="#FFFFFF"
            color="green"
          />
        </View>
        <View style = {{flex:3}}>
          <DisplayCurrIngredients/>
        </View>


        <View style = {{flex:1}}>
          <Button
            rounded
            onPress={this.submitIngredients}
            title="FIND A RECIPE"
            backgroundColor="#60A65F"
            color="#FFFFFF"
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
