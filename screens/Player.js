import { ImageBackground, View, Text, TouchableOpacity, Button, BackHandler, Image } from "react-native";
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from "react";

export default function Player({ navigation, route }) {

    const { icon, song } = route.params;
    const SampleTrack = { uri: song };

    const sound = useRef(new Audio.Sound());
    const intervalWidth = useRef(null)

    const [soundDetails, setSoundDetails] = useState(null);
    const [loadingWidth, setLoadingWidth] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        loadAudio();
    }, [])

    const loadAudio = async () => {
        const checkLoaded = await sound.current.getStatusAsync();
        if (checkLoaded.isLoaded === false) {
            await sound.current.loadAsync(SampleTrack, {}, true).then(() => {
                getAudioDetails();
            });
        }
    }

    const getAudioDetails = async () => {
        await sound.current.getStatusAsync().then(data => {
            if (data) {
                setSoundDetails(data);
            }
        })
    }

    const handleAudio = async () => {
        if (isPlaying == true) {
            PauseAudio();
        } else {
            PlayAudio();
        }
    }

    const PlayAudio = async () => {
        if (soundDetails.isLoaded) {
            if (soundDetails.isPlaying === false) {
                sound.current.playFromPositionAsync(timer*1000);
                setIsPlaying(true);
                LoadAudioBar();
            }
        }
    };

    const PauseAudio = async () => {
        if (soundDetails.isLoaded) {
            sound.current.pauseAsync();
            window.clearInterval(intervalWidth.current);
            setIsPlaying(false);
        }
    };

    const LoadAudioBar = () => {
        let duration = Math.floor(soundDetails.durationMillis / 1000);
        let timerAux = timer;
        intervalWidth.current = setInterval(() => {
            timerAux++;
            setTimer((timer) => timer + 1);

            setLoadingWidth(Math.floor((timerAux * 100) / duration));

            if (timerAux === duration) {
                window.clearInterval(intervalWidth.current);
                setIsPlaying(false);
                setTimer(0);
            }
        }, 1000)

        BackHandler.addEventListener('hardwareBackPress', function aaa() {
            window.clearInterval(intervalWidth);
            BackHandler.removeEventListener("hardwareBackPress", aaa);
            setSoundDetails(null);
            setIsPlaying(false);
            setLoadingWidth(0);
            setTimer(0);
            sound.current.stopAsync();
            sound.current.unloadAsync();
        })
    }

    return (
        <>
            <ImageBackground style={{ flex: 1, justifyContent: "flex-end" }} source={{ uri: icon }}>


            <View style={{ backgroundColor: "rgba(56,56,56,0.75)", paddingHorizontal: 40, paddingVertical: 40, justifyContent: "center", alignItems: "center", borderTopRightRadius: 50, borderTopLeftRadius: 50 }}>


                <View style={{ width: "100%", height: 15, backgroundColor: "gray", marginBottom: 20, borderRadius: 15 }}>
                    <View style={{ width: `${loadingWidth}%`, backgroundColor: "white", height: 15, borderRadius: 15 }}></View>
                </View>


                <TouchableOpacity style={{ width: 75, height: 75 }} onPress={() => {
                    handleAudio();
                }}>
                    {isPlaying ?
                        <Image style={{ width: "100%", height: "100%" }} source={require("../assets/pause.png")} />
                        :
                        <Image style={{ width: "100%", height: "100%" }} source={require("../assets/play.png")} />
                    }
                </TouchableOpacity>

            </View>

            </ImageBackground>

        </>
    )


}