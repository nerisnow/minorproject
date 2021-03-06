//checkout bill screen
import React from "react";
import firebase from "react-native-firebase";
import {
  FlatList,
  Text,
  Button,
  View,
  ImageBackground,
  TextInput,
  Alert
} from "react-native";

import { createStackNavigator, createAppContainer } from "react-navigation";
import CartItem from "./CartItem";
import Mybutton from "./components/Mybutton";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("orders");
    this.state = {
      textInput: "",
      total: 0,
      items: [],
      userName: null,
      address: null,
      phone: null
    };
    console.log("test1");
    this.getCart();
  }

  getCart = async () => {
    try {
      const cartItems = await AsyncStorage.getItem("@cart");
      console.log("test2");
      if (cartItems !== null) {
        var items = JSON.parse(cartItems);
        console.log(items);
        var cartitems = Object.values(items);
        var total = 0;
        cartitems.forEach(item => {
          total = total + item.qty * item.price;
        });
        console.log(total);
        this.setState({
          items,
          total,
          loading: false
        });
      }
    } catch (e) {
      // saving error
    }
  };

  async componentDidMount() {
    AsyncStorage.getItem("@userName").then(value => {
      this.setState({ userName: value });
    });
  }

  updateAddress(useraddress) {
    this.setState({ address: useraddress });
  }

  updatePhone(userphone) {
    this.setState({ phone: userphone });
  }

  confirmOrder = async () => {
    this.ref.add({
      items: this.state.items,
      total: this.state.total,
      username: this.state.userName,
      address: this.state.address,
      phone: this.state.phone
    });

    Alert.alert(
      "Order Confirmed",
      "Your order has been placed successfully. Thank you",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
    this.clearCart();
  };

  clearCart = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      //error
    }
  };

  render() {
    console.log("render");
    var cartitems = Object.values(this.state.items);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          flexDirection: "column"
        }}
      >
        <ImageBackground
          source={require("./tea.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            <FlatList
              data={cartitems}
              renderItem={({ item }) => <CartItem {...item} />}
            />
          </View>
          <View>
            <Text style={{ color: "white" }}>Total</Text>
            <Text style={{ color: "white", textAlign: "right" }}>
              {this.state.total}
            </Text>
            <Text style={{ color: "white" }}>Ordered by:</Text>
            <Text style={{ color: "white", textAlign: "right" }}>
              {this.state.userName}
            </Text>
          </View>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              color: "white"
            }}
            placeholder={"Drop your address"}
            placeholderTextColor={"white"}
            value={this.state.address}
            onChangeText={text => this.updateAddress(text)}
          />
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              color: "white"
            }}
            placeholder={"Drop your phone no."}
            placeholderTextColor={"white"}
            value={this.state.phone}
            onChangeText={text => this.updatePhone(text)}
          />
          <Mybutton title="CLEAR CART " customClick={() => this.clearCart()} />
          <Mybutton
            title="CONFIRM ORDER "
            customClick={() => this.confirmOrder()}
          />
        </ImageBackground>
      </View>
    );
  }
}
