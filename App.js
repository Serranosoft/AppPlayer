import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import Player from './screens/Player';
import Home from './screens/Home';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";

export default function App() {

    const Stack = createNativeStackNavigator();
    const Tab = createMaterialTopTabNavigator();
    const [appIsReady, setAppIsReady] = useState(false);


    const getFonts = () => Font.loadAsync({
        heading: require("./assets/fonts/RustyHooksRegular.ttf"),
    });

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                getFonts();
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
    }

    useEffect(() => {
        if (appIsReady) {
            hideSplashScreen();
        }
    }, [appIsReady])


    if (appIsReady) {
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
    }
}
