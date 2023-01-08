import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import { useFonts } from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import Player from './screens/Player';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {

    const Stack = createNativeStackNavigator();
    const [appIsReady, setAppIsReady] = useState(false);

    const [fontsLoaded] = useFonts({
        heading: require("./assets/fonts/RustyHooksRegular.ttf"),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{flex: 1}} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Text></Text>
                <Stack.Navigator initialRouteName='Home'>
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
        </View>

    );

}
