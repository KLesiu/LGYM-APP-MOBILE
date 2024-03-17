import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Preload from './Components/Preload';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';

import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Stack = createNativeStackNavigator();

const App:React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Preload">
        <Stack.Screen name="Preload" component={Preload}  options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login } options={{ headerShown: false }}/>
        <Stack.Screen name='Register' component={Register}  options={{ headerShown: false }}/>
        <Stack.Screen name='Home' component={Home}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;