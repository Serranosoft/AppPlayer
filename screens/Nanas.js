import { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../src/supabaseClient";

export default function Nanas({ navigation }) {

    // Subcategorias.
    const [nanas, setNanas] = useState([]);

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

        let songIndex = arr.indexOf(songName.replace("mp3", "jpg"));

        navigation.navigate("Player", { songIndex, folder })
    }

    useEffect(() => {
        getIconsByFolder("nanas", setNanas);
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
                    paddingTop: 20,
                }}>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ marginLeft: 12, marginBottom: 20, fontSize: 30, color: "#95E3EB", fontFamily: "heading" }}>Nanas</Text>

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}>
                            {
                                nanas.map((icon, i)=> {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => {
                                            getSongIndexFromFolder("nanas", icon, nanas);
                                        }}>
                                            <Image style={{ width: 70, height: 70, margin: 12, borderRadius: 25 }} source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Red_flag.svg/2560px-Red_flag.svg.png" }} />
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