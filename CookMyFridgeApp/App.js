import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { SearchBar, Icon, Badge, Button, Card } from 'react-native-elements';
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
      view: "Home",
      results: [],
      recipe: {},
    };
    this.addIngredient = this.addIngredient.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startCamera = this.startCamera.bind(this);
    this.goRecipePage = this.goRecipePage.bind(this);
    this.goResultPage = this.goResultPage.bind(this);
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
      //alert(data);
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
    ingre = this.state.ingredients;
    for (i in ingre){
      ingre[i] = ingre[i][0].toUpperCase() + ingre[i].substr(1);
    }
    fetch('https://cook-my-fridge.herokuapp.com/getRecipes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: ingre,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //alert("hello" + JSON.stringify(responseJson));
      if (JSON.stringify(responseJson) == "[]"){
        alert("No Results Found.")
        this.reset();
        return
      }
      this.setState({
        isVisible: true,
        results: responseJson,
        view: "Results"
      });
      //this.setState({valid: true});
      //this.setState({text: responseJson[0].name})
    })
    .catch((error) => {
      console.error(error);
    });
  }
  reset = () => {
    this.setState({
      text: "",
      valid: false,
      ingredients: [],
      isVisible: false,
      view: "Home",
    });
  }
  goResultPage = () => {
    this.setState({
      view: "Results"
    });
  }
  goRecipePage = (recipe) => {
    this.setState({
      view: "Recipe",
      "recipe": recipe
    });
  }
  render(){
    if (this.state.view == "Home"){
      return this.render_home();
    } else if (this.state.view == "Results"){
      return this.render_results();
    } else if (this.state.view == "Recipe"){
      return this.render_recipe();
    }
    return this.render_home();
  }
  render_recipe() {
    //alert(Object.keys(this.state.recipe))
    return (
      <View style={styles.container}>
        <View style= {{flex:1, paddingTop:80}}>
          <Text style={styles.title}>Cook My Fridge</Text>
          <Text>Made for people who cannot cook.</Text>
        </View>
        <View style = {{flex:4, padding: 0}}>
          <Text style={{fontSize:30, fontWeight:'bold'}}>{this.state.recipe.name}</Text>
          <Image
                  resizeMode="cover"
                  style={styles.imageBigly}
                  source={{ uri: this.state.recipe.image }}
                />
          <Text><Text style={{fontWeight:'bold'}}>Ingredients: </Text>{function(ingredients){
            var retv = "";
            for (i in ingredients){
              retv += ingredients[i] + ' ';
            }
            return retv;
          }(this.state.recipe.ingredients)}</Text>
          <Text>{'\n'}</Text>
          <Text style={{fontWeight:'bold'}}>Directions:</Text>
          <Text>{this.state.recipe.recipe}</Text>
        </View>
        <View style = {{flex:1}}>
          <Button
            rounded
            onPress={this.goResultPage}
            title="BACK"
            backgroundColor="#60A65F"
            color="#FFFFFF"
          />
          </View>
      </View>
      )
  }
  render_results() {
    const DisplayRecipeCards = () => {
      return (
      <View style={{flex:1}}>
        {
          this.state.results.map((u, i) => {
            return (
              <Card key={i} containerStyle={{padding:0, width:300, height:75}} >
              <TouchableWithoutFeedback onPress={this.goRecipePage.bind(null, u)}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  resizeMode="cover"
                  style={styles.image}
                  source={{ uri: u.image }}
                />
                <Text style={styles.subtitle}>{u.name}</Text>
                </View>
                </TouchableWithoutFeedback>
              </Card>
            );
          })
        }
      </View>
      )
     /*   <Card containerStyle={{padding:0}}>
        {
          this.state.results.map((u, i) => {
            return (
              <View key={i} style = {{flex: 1}}>
                <Image
                  resizeMode="cover"
                  source={{ uri: u.image }}
                />
                <Text style={styles.name}>{u.name}</Text>
              </View>
            );
          })
        }
        </Card>)*/ /*
        <View>{ this.state.results.map((item, key)=>(
          <View style={{height:75, marginTop: 5}}>
          <Text>{item.name}</Text>
          </View>
      ))}
        </View>
      );*/
    }
    return (
      <View style={styles.container}>
        <View style= {{flex:1, paddingTop:80}}>
          <Text style={styles.title}>Cook My Fridge</Text>
          <Text>Made for people who cannot cook.</Text>
        </View>
        <View style = {{flex:4, padding: 0}}>
          <DisplayRecipeCards/>
        </View>
        <View style = {{flex:1}}>
          <Button
            rounded
            onPress={this.reset}
            title="FIND A RECIPE"
            backgroundColor="#60A65F"
            color="#FFFFFF"
          />
          </View>
      </View>
      )
  }

  render_home() {
    const DisplayCurrIngredients = () => {
      return (
        <View>{ this.state.ingredients.map((item, key)=>(
          <View key={key} style={{marginTop: 5}}><Badge containerStyle={{ backgroundColor: '#60A65F', flexDirection: 'row'}}><Icon name='close' color='#FFFFFF' onPress={() => this.deleteIngredient(item)}/><Text style = {{color:'white'}}>{item}</Text></Badge></View>)
        )}
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style= {{flex:1, paddingTop:80}}>
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 75,
    height: 75,
    marginRight: 10,
  },
  imageBigly: {
    width: 300,
    height: 175,
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
