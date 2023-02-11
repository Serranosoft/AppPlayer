import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Nanas from './Nanas';
import Sounds from './Sounds';

export default function Home() {

    const Tab = createMaterialTopTabNavigator();

    return (

        <Tab.Navigator
            screenOptions={{
                "tabBarActiveTintColor": "#95E3EB",
                "tabBarInactiveTintColor": "#95E3EB",
                "tabBarPressColor": "transparent",
                "tabBarPressOpacity": 1,
                "tabBarLabelStyle": {
                    "fontSize": 26,
                    "fontFamily": "heading"
                },
                "tabBarItemStyle": {
                    "alignItems": "center",
                },
                "tabBarIndicatorStyle": {
                    "backgroundColor": "#95E3EB",
                    "height": 5,
                    "borderRadius": 100
                },
                "tabBarStyle": {
                    "justifyContent": "center",
                    "backgroundColor": "#2b66b3",
                    "height": 75,
                    "marginTop": 24,
                    "width": "100%"
                }
            }}>
            <Tab.Screen
                name="Nanas"
                component={Nanas}
            />
            <Tab.Screen
                name="Sonidos"
                component={Sounds}
            />
        </Tab.Navigator>
    )
}