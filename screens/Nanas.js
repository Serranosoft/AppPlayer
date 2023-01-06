import { ScrollView, StatusBar, Text, View } from "react-native"

export default function Nanas({ navigation }) {

    let tmp_arr = [
        "red", "white", "yellow", "green", "cyan", "white", "gray", "lightgray", "black", "pink"
    ]

    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: "#252A5D",
            paddingVertical: 60,
            paddingHorizontal: 20,
        }}>
            <ScrollView style={{
                flex: 1,   
            }}>

                <View style={{alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
                    <Text>Relajante</Text>

                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginHorizontal: 8
                    }}>
                        {
                            tmp_arr.map(el => {
                                return (
                                    <View style={{ width: "20%", height: 70, backgroundColor: el, margin: 12 }}></View>
                                )
                            })
                        }
                    </View>

                </View>

                <View>
                    <Text>Lúdico</Text>

                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginHorizontal: 8
                    }}>
                        {
                            tmp_arr.map(el => {
                                return (
                                    <View style={{ width: "20%", height: 70, backgroundColor: el, margin: 8 }}></View>
                                )
                            })
                        }
                    </View>

                </View>


            </ScrollView>
        </View>
    )

}