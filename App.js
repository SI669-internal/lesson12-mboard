import React from 'react';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBR8CCzH290bArWX9owXJRnRCC24K5mvnM",
  authDomain: "lesson12-simplechat.firebaseapp.com",
  databaseURL: "https://lesson12-simplechat.firebaseio.com",
  projectId: "lesson12-simplechat",
  storageBucket: "lesson12-simplechat.appspot.com",
  messagingSenderId: "631523190218",
  appId: "1:631523190218:web:f3613e9531a63efdb31b33"
};


export default class App extends React.Component {
  constructor(props)  {
    super(props);
    if (firebase.apps.length == 0) {
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore(); 
    this.messagesRef = db.collection('messages');
    this.state = {
      messages: []
    };
    this.messagesRef.get().then(querySnapshot => {
      let initMessages =  [];
      querySnapshot.forEach(docSnapshot => {
        let theMessage = {
          text: docSnapshot.data().text,
          timestamp: docSnapshot.data().timestamp,
          key: docSnapshot.id
        };
        initMessages.push(theMessage);
      });
      this.setState({messages: initMessages});
    });
  }

  handlePostMessage = () => {
    let message = this.state.inputText;
    if (message === '') {
      return;
    }
    this.setState({
      inputText: ''
    });

    this.messagesRef.add({text: this.state.inputText}).then(docRef => {
      let newMessages = this.state.messages.slice();
      newMessages.push({
        text: message, 
        timestamp: Date.now(),
        key: docRef.id,
      });

      this.setState({
        messages: newMessages,
        inputText: ''
      });
    });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <View style={styles.headerContainer}>
          <Text>Hello, you!</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList 
            data={this.state.messages}
            renderItem={({item})=>{
              return(
                <Text>{item.text}</Text>
              );
            }}
          />
        </View>

        <View style={styles.footerContainer}>
          <Input
            placeholder="Enter message"
            value={this.state.inputText}
            onChangeText={(text)=>{this.setState({inputText: text})}}
          />
          <Button
            title="Post"
            onPress={this.handlePostMessage}
          />
        </View>
      </KeyboardAvoidingView>

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
  headerContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',  
    padding: 30
  },
  listContainer: {
    flex: 0.3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 30
  },
  footerContainer: {
    flex: 0.3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 30
  }
});
