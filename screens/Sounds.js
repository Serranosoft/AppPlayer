import { useEffect, useState } from "react"
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../src/supabaseClient"

export default function Sounds({ navigation }) {

    // Subcategorias.
    const [nature, setNature] = useState([]);
    const [cotidiano, setCotidiano] = useState([]);


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

    async function getSongIndexFromFolder(folder, songName, icon) {

        const { data, error } = await supabase.storage.from("test").list(`${folder}/sounds`, { limit: 100 });

        data.forEach((song, songIndex) => {
            if (song.name == songName) {
                navigation.navigate("Player", { songIndex, folder })
            }
        })

    }

    useEffect(() => {
        getIconsByFolder("naturaleza", setNature);
        getIconsByFolder("cotidiano", setCotidiano);
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
                                            getSongIndexFromFolder("naturaleza", icon.substring(icon.lastIndexOf('/') + 1).replace("jpg", "mp3"), icon);
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
                                            getSongIndexFromFolder("cotidiano", icon.substring(icon.lastIndexOf('/') + 1).replace("jpg", "mp3"), icon);
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
                                cotidiano.map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder("cotidiano", icon.substring(icon.lastIndexOf('/') + 1).replace("jpg", "mp3"), icon);
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