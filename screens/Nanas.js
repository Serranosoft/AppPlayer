import { ScrollView, StatusBar, Text, View } from "react-native"

export default function Nanas({ navigation }) {

    let tmp_arr = [
        "red", "white", "yellow", "green", "cyan", "white", "gray", "lightgray", "black", "pink"
    ]

    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: "#2b66b3",
            paddingHorizontal: 20,
            paddingBottom: 20,
        }}>
            <ScrollView style={{
                flex: 1,   
                paddingTop: 20,
            }}>
                <View style={{marginVertical: 20}}>
                    <Text style={{marginLeft: 12, marginBottom: 20, fontSize: 33, color: "#95E3EB"}}>Relajante</Text>

                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}>
                        {
                            tmp_arr.map(el => {
                                return (
                                    <View style={{ width: 70, height: 70, backgroundColor: el, margin: 12 }}></View>
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
                                    <View style={{ width: "20%", height: 70, backgroundColor: el, margin: 12 }}></View>
                                )
                            })
                        }
                    </View>

                </View>


            </ScrollView>
        </View>
    )

}