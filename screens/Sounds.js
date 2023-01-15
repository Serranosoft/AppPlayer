import { useEffect, useState } from "react"
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../src/supabaseClient"

export default function Sounds({ navigation }) {

    // Subcategorias.
    const [nature, setNature] = useState([]);
    const [cotidiano, setCotidiano] = useState([]);
    const [electrodomesticos, setElectrodomesticos] = useState([]);
    const [ruidoBlanco, setRuidoBlanco] = useState([]);


    async function getIconsByFolder() {
        await supabase.storage.from("test").list("icons").then((res) => {
            res.data.forEach((song) => {
                const { data, error } = supabase.storage.from('test').getPublicUrl(`icons/${song.name}`);
                let segment = data.publicUrl.substring(data.publicUrl.lastIndexOf('/') + 1)

                if (segment.substring(0, segment.indexOf("-")) == "cotidiano") {
                    setCotidiano(cotidiano => [...cotidiano, data.publicUrl]);
                }
                if (segment.substring(0, segment.indexOf("-")) == "electrodomestico") {
                    setElectrodomesticos(electrodomesticos => [...electrodomesticos, data.publicUrl]);
                }
                if (segment.substring(0, segment.indexOf("-")) == "naturaleza") {
                    setNature(nature => [...nature, data.publicUrl]);
                }
                if (segment.substring(0, segment.indexOf("-")) == "ruidoblanco") {
                    setRuidoBlanco(ruidoBlanco => [...ruidoBlanco, data.publicUrl]);
                }
            })
        });
    }

    async function getSongIndexFromFolder(icon) {
        let songUrl = icon.substring(icon.lastIndexOf('/') + 1).replace("jpg", "mp3");
        supabase.storage.from("test").list(`sounds`).then((res) => {
            let index = res.data.map(function (song) { return song.name; }).indexOf(songUrl);
            navigation.navigate("Player", { songIndex: index })
        })
    }

    useEffect(() => {
        getIconsByFolder();
    }, [])

    return (
        <ImageBackground
            style={{ flex: 1 }}
            source={require("../assets/background.jpg")}
        >
            <View style={{
                flex: 1,
                alignItems: "center",
                paddingHorizontal: 10,
                paddingBottom: 20,
            }}>

                <ScrollView style={{
                    flex: 1,
                    paddingTop: 20
                }}
                >
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ marginLeft: 12, marginBottom: 20, fontSize: 30, color: "#95E3EB", fontFamily: "heading" }}>Cotidiano</Text>

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            {
                                cotidiano.map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder(icon);
                                        }}>
                                            <Image style={{ width: 70, height: 70, margin: 12, borderRadius: 25 }} source={{ uri: icon }} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ marginLeft: 12, marginBottom: 20, fontSize: 30, color: "#95E3EB", fontFamily: "heading" }}>Electrodomésticos</Text>

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            {
                                electrodomesticos.map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder(icon);
                                        }}>
                                            <Image style={{ width: 70, height: 70, margin: 12, borderRadius: 25 }} source={{ uri: icon }} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ marginLeft: 12, marginBottom: 20, fontSize: 30, color: "#95E3EB", fontFamily: "heading" }}>Naturaleza</Text>

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            {
                                nature.map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder(icon);
                                        }}>
                                            <Image style={{ width: 70, height: 70, margin: 12, borderRadius: 25 }} source={{ uri: icon }} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </View>



                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ marginLeft: 12, marginBottom: 20, fontSize: 30, color: "#95E3EB", fontFamily: "heading" }}>Ruido blanco</Text>

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            {
                                ruidoBlanco.map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder(icon);
                                        }}>
                                            <Image style={{ width: 70, height: 70, margin: 12, borderRadius: 25 }} source={{ uri: icon }} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </View>

                </ScrollView>



            </View>

        </ImageBackground>

    )

}