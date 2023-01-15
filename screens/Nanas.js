import { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../src/supabaseClient";

export default function Nanas({ navigation }) {

    // Subcategorias.
    const [nanas, setNanas] = useState([]);

    async function getIconsByFolder() {
        await supabase.storage.from("test").list("icons").then((res) => {
            res.data.forEach((song) => {
                const { data, error } = supabase.storage.from('test').getPublicUrl(`icons/${song.name}`);
                let segment = data.publicUrl.substring(data.publicUrl.lastIndexOf('/') + 1)
                console.log(segment);
                if (segment.substring(0, segment.indexOf("-")) == "nana") {
                    setNanas(nanas => [...nanas, data.publicUrl]);
                }
            })
        });
    }

    async function getSongIndexFromFolder(icon) {
        let songUrl = icon.substring(icon.lastIndexOf('/') + 1).replace("jpg", "mp3");
        supabase.storage.from("test").list(`sounds`).then((res) => {
            let index = res.data.map(function(song) { return song.name; }).indexOf(songUrl);
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
                                        <View style={{width: "30%", marginHorizontal: 6, marginBottom: 12}}>
                                            <TouchableOpacity key={i} onPress={() => {
                                                getSongIndexFromFolder(icon);
                                            }}>
                                                <Image resizeMode="contain" style={{ width: "100%", flex: 1, height: 100, borderRadius: 25 }} source={{ uri: icon }} />
                                            </TouchableOpacity>
                                        </View>
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