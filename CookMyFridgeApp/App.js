/*import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { Camera, Permissions } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      valid: false,
      ingredients: [],
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
    this.addIngredient = this.addIngredient.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  addIngredient = () => {
    //this.setState({ingredients: this.state.ingredients + this.state.text})
    var newIngredient = this.state.ingredients.slice();
    newIngredient.push(this.state.text);
    this.setState({
        ingredients: newIngredient
    });
    //this.state.ingredients.push(this.state.text);
    this._textInput.setNativeProps({text: ''});
    //this.state.text = "";
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
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    const DisplayCurrIngredients = () => {
      return (<View>{ this.state.ingredients.map((item, key)=>(
        <Text> { item } </Text>)
        )}</View>);
    }
    return (
      <View style={styles.container}>
        <View style= {{flex:2, paddingTop:50}}>
          <Text style={styles.title}>Cook My Fridge</Text>
          <Text>Made for people who cannot cook.</Text>
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
*/
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref => {this.camera = ref;}} style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  let pic = this.camera.takePictureAsync().then(function (obj, err) {
                    alert(obj.uri);
                    const data = new FormData();
                    data.append('images_file', obj.uri);
                    fetch('https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=9e9ef1bd4cc1a890cb8bb52ff799f425f4b93919&version=2016-05-20', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: data
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                      console.log(responseJson)
                      alert(responseJson.images.classifiers[0].name)
                      //this.setState({text: responseJson[0].name})
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                  });

                  /*this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });*/

                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
