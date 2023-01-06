import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Nanas from './Nanas';
import Sounds from './Sounds';
import Apploading from "expo-app-loading";


export default function Home() {

    const Tab = createMaterialTopTabNavigator();

    return (

            <Tab.Navigator
                tabBarOptions={{
                    pressColor: 'transparent',
                    pressOpacity: 1,
                    labelStyle: {
                        fontSize: 16,
                        textTransform: 'none',
                    },
                    style: {
                        backgroundColor: "#252A5D",
                        height: 50,
                        elevation: 0,
                        marginTop: StatusBar.currentHeight,
                    },
                    indicatorStyle: {
                        backgroundColor: 'red',
                        height: 4,
                    },
                    tabStyle: { width: 'auto', marginLeft: 10, alignItems: 'center' },
                }}>
                <Tab.Screen
                    name="Nanas"
                    component={Nanas}
                /* options={{ headerShown: false }} */
                />
                <Tab.Screen
                    name="Sounds"
                    component={Sounds}
                /* options={{ headerShown: false }} */
                />
            </Tab.Navigator>
    )
}