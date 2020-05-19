import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatComponent from "./pages/chat.component";
import RegistrationComponent from "./pages/registration.component";
import LoginComponent from "./pages/login.component";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginComponent}/>
                <Stack.Screen name="Register" component={RegistrationComponent}/>
                <Stack.Screen name="Chat" component={ChatComponent}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
