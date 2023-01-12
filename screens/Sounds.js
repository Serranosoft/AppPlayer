import { useEffect, useState } from "react"
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../src/supabaseClient"

export default function Sounds({ navigation }) {

    // Subcategorias.
    const [nature, setNature] = useState([]);
    const [cotidiano, setCotidiano] = useState([]);
    const [electrodomesticos, setElectrodomesticos] = useState([]);
    const [ruidoBlanco, setRuidoBlanco] = useState([]);


    async function getIconsByFolder(folder, setter) {
        let icons = [];

        const { data, error } = await supabase.storage.from("test").list(`${folder}/icons`, { limit: 100 });

        data.forEach(icon => {
            if (data !== null && data.length > 0 && icon.name !== ".emptyFolderPlaceholder") {
                const { data, error } = supabase.storage.from('test').getPublicUrl(`${folder}/icons/${icon.name}`);
                icons.push(data.publicUrl);
            }
        })

        setter(icons);
    }

    async function getSongIndexFromFolder(folder, songName, arr) {
        supabase.storage.from("test").list(`${folder}/sounds`, {
            limit: 10,
        }).then((res) => {
            let index = res.data.map(function(song) { return song.name; }).indexOf(songName.substring(songName.lastIndexOf('/') + 1).replace("jpg", "mp3"));
            navigation.navigate("Player", { songIndex: index, folder })
        })
    }

    useEffect(() => {
        getIconsByFolder("naturaleza", setNature);
        getIconsByFolder("cotidiano", setCotidiano);
        getIconsByFolder("electrodomesticos", setElectrodomesticos);
        getIconsByFolder("ruido-blanco", setRuidoBlanco);
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
                        <Text style={{ marginLeft: 12, marginBottom: 20, fontSize: 30, color: "#95E3EB", fontFamily: "heading" }}>Naturaleza</Text>
                        
                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            {
                                nature.map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder("naturaleza", icon, nature);
                                        }}>
                                            <Image style={{ width: 70, height: 70, margin: 12, borderRadius: 25 }} source={{ uri: icon }} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </View>

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
                                            getSongIndexFromFolder("cotidiano", icon, cotidiano);
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
                                            getSongIndexFromFolder("electrodomesticos", icon, electrodomesticos);
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
                                            getSongIndexFromFolder("ruido-blanco", icon, ruidoBlanco);
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