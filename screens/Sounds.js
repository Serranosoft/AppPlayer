import { useEffect, useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../src/supabaseClient"

export default function Sounds({ navigation }) {

    let tmp_arr = [
        "red", "white", "yellow", "green", "cyan", "white", "gray", "lightgray", "black", "pink"
    ]

    // Subcategorias.
    const [nature, setNature] = useState([]);
    

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
    }, [])

    return (

        <View style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 60,
            backgroundColor: "#252A5D"
        }}>

            <ScrollView style={{ flex: 1 }}>
                <View>
                    <Text>Naturaleza</Text>
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
                                        <Image style={{width: 70, height: 70, margin: 12}} source={{uri: icon}} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>

                </View>

                <View>
                    <Text>Instrumentos</Text>

                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}>
                        {
                            tmp_arr.map(el => {
                                return (
                                    <View style={{ width: "20%", height: 70, backgroundColor: el }}></View>
                                )
                            })
                        }
                    </View>

                </View>

                <View>
                    <Text>Electrodomesticos</Text>

                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}>
                        {
                            tmp_arr.map(el => {
                                return (
                                    <View style={{ width: "20%", height: 70, backgroundColor: el }}></View>
                                )
                            })
                        }
                    </View>

                </View>

            </ScrollView>



        </View>

    )

}