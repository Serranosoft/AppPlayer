import { ImageBackground, View, TouchableOpacity, BackHandler, Image, Text } from "react-native";
import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../src/supabaseClient"
import { useFocusEffect } from '@react-navigation/native';

export default function Player({ navigation, route }) {

    const { songIndex, folder } = route.params;

    const sound = useRef(new Audio.Sound());
    const intervalWidth = useRef(null)
    // const isLoop = useRef(false);
    const songTrack = useRef(null);
    const nextSongIndex = useRef(songIndex);

    // Conocer la cantidad de canciones que tiene el subfolder para saber hasta cuanto puedo avanzar.
    const [folderLength, setFolderLength] = useState(0);
    // Actualizar detalles de la canción.
    const [soundDetails, setSoundDetails] = useState(null);
    // Carga de la barra para ir pintandola mientras se reproduce.
    const [loadingWidth, setLoadingWidth] = useState(0);
    // Auxiliar para saber si la canción se está reproduciendo
    const [isPlaying, setIsPlaying] = useState(true);
    // Auxiliar para saber si la canción está muteada
    const [isMuted, setIsMuted] = useState(false);
    // Auxiliar para saber si la canción está en loop
    const [isLoop, setIsLoop] = useState(false);
    // Timer para actualizar cuanto lleva reproduciéndose
    const [timer, setTimer] = useState(0);
    // Ilustración a renderizar en pantalla.
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        getSong();
    }, [])

    useEffect(() => {
        if (soundDetails != null) {
            PlayAudio();
        }
    }, [soundDetails])

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate("Home");
                resetAll();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', (onBackPress));
            return () =>
                BackHandler.removeEventListener('hardwareBackPress');
        }, [])
    );

    const resetAll = () => {
        window.clearInterval(intervalWidth);
        sound.current.stopAsync();
        sound.current.unloadAsync();
        setIsLoop(false);
        setSoundDetails(null);
        setIsPlaying(true);
        setLoadingWidth(0);
        setTimer(0);
    }

    const getSong = async () => {
        await supabase.storage.from("test").list(`${folder}/sounds/`, { limit: 100 }).then((res) => {
            setFolderLength(res.data.length);
            getSongUrl(res.data[songIndex].name);
            getImage(res.data[songIndex].name);
        });
    }

    const getSongUrl = (songName) => {
        const { data, error } = supabase.storage.from('test').getPublicUrl(`${folder}/sounds/${songName}`);

        songTrack.current = data.publicUrl;
        loadAudio();
    }

    const getImage = async (songName) => {
        const { data, error } = supabase.storage.from("test").getPublicUrl(`${folder}/icons/${songName.replace("mp3", "jpg")}`)
        setIcon(data.publicUrl);
    }

    const loadAudio = async () => {
        const checkLoaded = await sound.current.getStatusAsync();
        if (checkLoaded.isLoaded === false) {
            await sound.current.loadAsync({ uri: songTrack.current }, {}, true).then(() => {
                getAudioDetails();
            });
        }
    }

    const muteAudio = () => {
        if (isMuted) {
            sound.current.setIsMutedAsync(false);
            setIsMuted(false)
        } else {
            sound.current.setIsMutedAsync(true);
            setIsMuted(true)
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
                if (isLoop) {
                    sound.current.playAsync();
                } else {
                    sound.current.playFromPositionAsync(timer * 1000);
                }
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

    const LoopAudio = async () => {
        if (soundDetails.isLoaded) {
            if (isLoop) {
                sound.current.setIsLoopingAsync(false);
                setIsLoop(false);
            } else {
                setIsLoop(true);
                sound.current.setIsLoopingAsync(true);
            }
        }
    }

    const LoadAudioBar = () => {
        let duration = Math.floor(soundDetails.durationMillis / 1000);
        let timerAux = timer;
        intervalWidth.current = setInterval(() => {
            timerAux++;
            setTimer((timer) => timer + 1);

            setLoadingWidth(Math.floor((timerAux * 100) / duration));
            if (timerAux === duration) {
                if (!isLoop) {
                    window.clearInterval(intervalWidth.current);
                    setIsPlaying(false);
                } else {
                    setLoadingWidth(0);
                    timerAux = 0;
                }
                setTimer(0);
            }
        }, 1000)
    }

    /*
    
        BUG: Debo ocultar botones hasta que la canción actual se cargue
    */
    return (
        <>
            <ImageBackground style={{ flex: 1, justifyContent: "flex-end" }} resizeMode="cover" source={{ uri: icon }}>


                <View style={{ backgroundColor: "rgba(17,66,130,0.75)", paddingHorizontal: 30, paddingTop: 40, paddingBottom: 20, justifyContent: "center", alignItems: "center", borderTopRightRadius: 50, borderTopLeftRadius: 50 }}>

                    <View style={{ width: "100%", height: 15, backgroundColor: "#858585", marginBottom: 20, borderRadius: 15 }}>
                        <View style={{ width: `${loadingWidth}%`, backgroundColor: "#e3f6f9", height: 15, borderRadius: 15 }}></View>
                    </View>

                    { soundDetails !== null && 
                    
                        <View style={{ width: "100%", paddingVertical: 0, flexDirection: "row", alignItems: "center", position: "relative", justifyContent: "space-around" }}>

                            <TouchableOpacity onPress={() => {
                                muteAudio();
                            }}>
                                <Image style={{
                                    width: 45,
                                    height: 45,
                                    resizeMode: "contain"
                                }}
                                    source={isMuted ? require("../assets/mute-on.png") : require("../assets/mute-off.png")} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (songIndex === 0) {
                                    nextSongIndex.current = folderLength - 1;
                                } else {
                                    nextSongIndex.current -= 1;
                                }
                                navigation.push("Player", { songIndex: nextSongIndex.current, folder, icon })
                                resetAll();
                            }}>
                                <Image style={{
                                    width: 45,
                                    height: 45,
                                    resizeMode: "contain"
                                }}
                                    source={require("../assets/prev.png")} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                handleAudio();
                            }}>
                                {isPlaying ?
                                    <Image style={{ width: 45, height: 45 }} source={require("../assets/pause.png")} />
                                    :
                                    <Image style={{ width: 45, height: 45 }} source={require("../assets/play.png")} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (songIndex === folderLength - 1) {
                                    nextSongIndex.current = 0;
                                } else {
                                    nextSongIndex.current += 1;
                                }
                                navigation.push("Player", { songIndex: nextSongIndex.current, folder, icon })
                                resetAll();
                            }}>
                                <Image style={{
                                    width: 45,
                                    height: 45,
                                    resizeMode: "contain"
                                }}
                                    source={require("../assets/next.png")} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                LoopAudio();
                            }}>
                                <Image style={{
                                    width: 45,
                                    height: 45,
                                    resizeMode: "contain"
                                }}
                                    source={isLoop ? require("../assets/loop-on.png") : require("../assets/loop-off.png")} />
                            </TouchableOpacity>

                        </View>
                    }


                </View>

            </ImageBackground>

        </>
    )


}