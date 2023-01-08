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
                    activeTintColor: "#95E3EB",
                    inactiveTintColor: "#95E3EB",  
                    labelStyle: {
                        fontSize: 26,
                        textTransform: 'none',
                    },
                    style: {
                        justifyContent: "center",
                        backgroundColor: "#2b66b3",
                        height: 75,
                        marginTop: StatusBar.currentHeight,
                        width: "100%",
                    },
                    indicatorStyle: {
                        backgroundColor: '#95E3EB',
                        height: 5,
                        borderRadius: 100,
                    },
                    tabStyle: { alignItems: 'center' },
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