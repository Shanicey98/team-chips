import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './screens/Map'

const Stack = createNativeStackNavigator();



export default function App() {
  return (

  <NavigationContainer>
  <Stack.Navigator initialRouteName='Map'>
  <Stack.Screen name = "map" component = {Map} />

    
  </Stack.Navigator>

  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});