import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: '',
      valid: false 
    };
    this.handleSearch = this.handleSearch.bind(this);
  }
  handleSearch = () => {
      
      if (this.state.text === 'fuck') {
        this.setState({valid: true});
      }
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
            onPress={this.handleSearch}
            title="Search"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
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
