import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Preload from './Components/Preload';
// import Login from './Components/Login';
// import Home from './Components/Home';
// import Register from './Components/Register';

const Stack = createNativeStackNavigator();

const App:React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Preload">
        <Stack.Screen name="Preload" component={Preload} />
        {/* <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;