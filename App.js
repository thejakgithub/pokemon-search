import React, { useEffect, useState } from 'react';
import axios from 'axios';
import pokemon from 'pokemon';
import Pokemon from './components/Pokemon';
import SplashScreen from  "react-native-splash-screen";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Button,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';


const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  });

  const [poke, setPoke] = useState({
    isLoading: false,
    searchInput: '',
    name: '',
    pic: null,
    types: [],
    desc: ''
  });

  const { name, pic, types, desc, searchInput, isLoading } = poke;

  const createAlert = () =>
    Alert.alert(
      "Error",
      "Pokemon not found",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );


  const searchPokemon = async () => {
    try {
    
      let input =  searchInput.charAt(0).toUpperCase() + searchInput.substring(1).toLowerCase();
    
      const pokemonID = pokemon.getId(input);

      setPoke({ isLoading: true });

      const { data: pokemonData } = await axios.get(`${POKE_API_BASE_URL}/pokemon/${pokemonID}`);
      const { data: pokemonSpecieData } = await axios.get(`${POKE_API_BASE_URL}/pokemon-species/${pokemonID}`);

      const { name, sprites, types } = pokemonData;
      const { flavor_text_entries } = pokemonSpecieData;

      setPoke({
        name,
        pic: sprites.front_default,
        types: getTypes(types),
        desc: getDescription(flavor_text_entries),
        isLoading: false
      });
    } catch (err) {
      createAlert();
      setPoke({searchInput:''});
    }
  }


  const getTypes = (types) => types.map(({ slot, type }) => ({
    id: slot,
    name: type.name
  }));


  const getDescription = (entries) => entries.find((item) => item.language.name === 'en').flavor_text;


  return (
    <SafeAreaView style={styles.wrrapper}>
      <View>
      <Image style={styles.image} source={{ uri: "https://www.kindpng.com/picc/m/2-24125_pokemon-logo-transparent-hd-png-download.png" }} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        
        <View style={styles.headContainer}>
          <View style={styles.textInputContainer}>
            <TextInput style={styles.textInput}
              placeholder="Search Pokemon"
              placeholderTextColor="#aaa"
              onChangeText={(searchInput) =>  setPoke({ searchInput })}
              value={searchInput}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Search"
              onPress={searchPokemon}
            />
          </View>
        </View>
        <View style={styles.mainContainer}>
          {isLoading && <ActivityIndicator style={styles.indicator} size={50} color="#0064e1" />}
          {!isLoading && (
            <Pokemon name={name} pic={pic} types={types} desc={desc} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrrapper: {
    flex: 1,
    backgroundColor:"#f5fcff"
  },
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f5fcff"
  },
  headContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop:20
  },
  textInputContainer: {
    flex: 2
  },
  buttonContainer: {
    flex: 1,
    marginLeft: 10,
  },
  mainContainer: {
    flex: 9
  },
  image: {
    height: 150,
    width: "auto",
    
  },
  textInput: {
    height: 35,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#eaeaea",
    padding: 5,
    color: "black"
  },
  indicator:{
    marginTop:80
  }
});

export default App;
