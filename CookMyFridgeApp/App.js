import React from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { SearchBar, Icon, Badge, Button } from 'react-native-elements';
import { Camera, Permissions, ImagePicker } from 'expo';
// import { Camera, Permissions } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      valid: false,
      ingredients: [],
      isVisible: false,
    };
    this.addIngredient = this.addIngredient.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startCamera = this.startCamera.bind(this);
    //this.deleteIngredient = this.deleteIngredient.bind(this);
  }
  addIngredient = () => {
    //this.setState({ingredients: this.state.ingredients + this.state.text})
    if(this.state.text === ""){
      return;
    }
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

  startCamera(){
    takeAndUploadPhotoAsync().then((resp, data) => {
      resp = JSON.parse(JSON.stringify(resp));
      //var keys = Object.keys(resp);
      //alert(JSON.stringify(keys));
      var sortedList = JSON.parse(resp._bodyInit).images[0].classifiers[0].classes.sort((a,b) => {
        return a.score < b.score;
      });
      this.setState({"text":sortedList[0].class})
      //alert(JSON.stringify(sortedList[0].class));
    })
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
      this.setState({
        isVisible: true
      });
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
          <View style={{flex: 2, flexDirection: 'row'}}>
          <Button
            onPress={this.addIngredient}
            title="Add Ingredient"
            backgroundColor="#FFFFFF"
            color="green"
          />
          <Button
            onPress={this.startCamera}
            title="Picture"
            backgroundColor = "#FFFFFF"
            color="purple"
          />
          </View>
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

async function takeAndUploadPhotoAsync() {
  // Display the camera to the user and wait for them to take a photo or to cancel
  // the action
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    aspect: [4, 3],
  });

  if (result.cancelled) {
    return;
  }

  // ImagePicker saves the taken photo to disk and returns a local URI to it
  let localUri = result.uri;
  let filename = localUri.split('/').pop();

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  formData.append('photo', { uri: localUri, name: filename, type });

  return await fetch('https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=9e9ef1bd4cc1a890cb8bb52ff799f425f4b93919&version=2016-05-20', {
    method: 'POST',
    body: formData,
    header: {
      'content-type': 'multipart/form-data',
    },
  });
}
