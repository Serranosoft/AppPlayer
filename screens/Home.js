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
                    activeTintColor: "black",
                    inactiveTintColor: "lightgray",  
                    labelStyle: {
                        fontSize: 16,
                        textTransform: 'none',
                    },
                    style: {
                        justifyContent: "center",
                        backgroundColor: "white",
                        height: 75,
                        elevation: 50,
                        marginTop: StatusBar.currentHeight,
                        width: "100%",
                    },
                    indicatorStyle: {
                        backgroundColor: 'black',
                        height: 5,
                        borderRadius: 100,
                    },
                    tabStyle: { /* width: 'auto', *//*  marginLeft: 10, */ alignItems: 'center',  },
                }}>
                <Tab.Screen
                    name="Nanas"
                    component={Nanas}
                /* options={{ headerShown: false }} */
                />
                <Tab.Screen
                    name="Sonidos"
                    component={Sounds}
                /* options={{ headerShown: false }} */
                />
            </Tab.Navigator>
    )
}