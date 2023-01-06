import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import Nanas from './screens/Nanas';
import Sounds from './screens/Sounds';
import * as Font from "expo-font";
import Apploading from "expo-app-loading";
import { StatusBar } from 'react-native';
import Player from './screens/Player';
import Home from './screens/Home';

export default function App() {

    const Stack = createNativeStackNavigator();
    const Tab = createMaterialTopTabNavigator();
    const [fontsloaded, setFontsLoaded] = useState(false);

    // const getFonts = () => Font.loadAsync({
    // heading: require("./assets/fonts/Source_Code_Pro/static/SourceCodePro-SemiBold.ttf"),
    // subtitle: require("./assets/fonts/Pragati_Narrow/PragatiNarrow-Regular.ttf"),
    // text: require("./assets/fonts/Nunito_Sans/NunitoSans-Regular.ttf")
    // });

    if (fontsloaded) {
        return (

            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Player"
                        component={Player}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <Apploading
                startAsync={/* getFonts */() => console.log("")}
                onFinish={() => {
                    setFontsLoaded(true);
                }}
                onError={console.warn}
            />
        );
    }
}
