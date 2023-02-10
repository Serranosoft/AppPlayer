import { ImageBackground, View, TouchableOpacity, BackHandler, Image, Text, Pressable } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../src/supabaseClient"
import { useFocusEffect } from '@react-navigation/native';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming }/* , { useSharedValue } */ from "react-native-reanimated";

export default function Player({ navigation, route }) {

    const { songIndex } = route.params;

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
    // Posición para animar
    const position = useSharedValue(0);

    const tap =
        Gesture.Pan().runOnJS(true)
            .activeOffsetX([50, 50])
            .onUpdate((e) => {
                position.value = e.translationX;
            })
            .onEnd((e) => {
                position.value = withTiming(position.value * 10, { duration: 150, easing: Easing.ease });
                if (e.translationX > 60) {
                    // Anterior canción.
                    if (nextSongIndex.current === 0) {
                        nextSongIndex.current = folderLength - 1;
                    } else {
                        nextSongIndex.current -= 1;
                    }

                    resetAll().then(() => {
                        getSong().then(() => {
                            position.value = 0;
                        });
                    });
                } else if (e.translationX < -60) {
                    // Siguiente canción.
                    if (nextSongIndex.current === folderLength - 1) {
                        nextSongIndex.current = 0;
                    } else {
                        nextSongIndex.current += 1;
                    }

                    resetAll().then(() => {
                        getSong().then(() => {
                            position.value = 0
                        });
                    });
                } else {
                    position.value = withTiming(0, { duration: 150, easing: Easing.ease });
                }


            });

    useEffect(() => {
        const applyMode = async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                playThroughEarpieceAndroid: false
            });
        }
        applyMode().then(() => {
            getSong();
        })
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

    const resetAll = async () => {
        window.clearInterval(intervalWidth.current);
        sound.current.stopAsync();
        sound.current.unloadAsync();
        setIsLoop(false);
        setSoundDetails(null);
        setIsPlaying(true);
        setLoadingWidth(0);
        setTimer(0);
    }

    const getSong = async () => {
        await supabase.storage.from("test").list(`sounds/`).then((res) => {
            setFolderLength(res.data.length);
            getSongUrl(res.data[nextSongIndex.current].name);
            getImage(res.data[nextSongIndex.current].name);
        });
    }

    const getSongUrl = (songName) => {
        const { data, error } = supabase.storage.from('test').getPublicUrl(`sounds/${songName}`);

        songTrack.current = data.publicUrl;
        loadAudio();
    }

    const getImage = async (songName) => {
        const { data, error } = supabase.storage.from("test").getPublicUrl(`icons/${songName.replace("mp3", "jpg")}`)
        setIcon(data.publicUrl);
    }

    const loadAudio = async () => {
        const checkLoaded = await sound.current.getStatusAsync();
        if (checkLoaded.isLoaded === false) {
            await sound.current.loadAsync({ uri: songTrack.current }, {}, false).then(() => {
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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        flex: 1,
    }));

    return (
        <View style={{ flex: 1, backgroundColor: "rgba(17,66,130,0.75)" }}>
            <Animated.View style={[animatedStyle]}>

                <ImageBackground style={{ flex: 1 }} resizeMode="cover" source={{ uri: icon + "?wyz" }}>
                    <GestureDetector gesture={tap}>
                        <View style={{ flex: 1 }}></View>
                    </GestureDetector>
                </ImageBackground>
            </Animated.View>

            <View style={{ position: "absolute", bottom: "0%", backgroundColor: "rgba(17,66,130,0.75)", paddingHorizontal: 30, paddingTop: 40, paddingBottom: 20, justifyContent: "center", alignItems: "center", borderTopRightRadius: 50, borderTopLeftRadius: 50 }}>

                <View style={{ width: "100%", height: 15, backgroundColor: "#858585", marginBottom: 20, borderRadius: 15 }}>
                    <View style={{ width: `${loadingWidth}%`, backgroundColor: "#e3f6f9", height: 15, borderRadius: 15 }}></View>
                </View>

                <View style={{ width: "100%", paddingVertical: 0, flexDirection: "row", alignItems: "center", position: "relative", justifyContent: "space-around" }}>

                    <Pressable onPress={() => {
                        muteAudio();
                    }}>
                        <Image style={{
                            width: 45,
                            height: 45,
                            resizeMode: "contain"
                        }}
                            source={isMuted ? require("../assets/mute-on.png") : require("../assets/mute-off.png")} />
                    </Pressable>

                    <Pressable onPress={() => {
                        if (nextSongIndex.current === 0) {
                            nextSongIndex.current = folderLength - 1;
                        } else {
                            nextSongIndex.current -= 1;
                        }

                        resetAll().then(() => {
                            getSong();
                        });
                    }}>
                        <Image style={{
                            width: 45,
                            height: 45,
                            resizeMode: "contain"
                        }}
                            source={require("../assets/prev.png")} />
                    </Pressable>
                    <Pressable onPress={() => {
                        handleAudio();
                    }}>
                        {isPlaying ?
                            <Image style={{ width: 45, height: 45 }} source={require("../assets/pause.png")} />
                            :
                            <Image style={{ width: 45, height: 45 }} source={require("../assets/play.png")} />
                        }
                    </Pressable>
                    <Pressable onPress={() => {
                        if (nextSongIndex.current === folderLength - 1) {
                            nextSongIndex.current = 0;
                        } else {
                            nextSongIndex.current += 1;
                        }

                        resetAll().then(() => {
                            getSong();
                        });
                    }}>
                        <Image style={{
                            width: 45,
                            height: 45,
                            resizeMode: "contain"
                        }}
                            source={require("../assets/next.png")} />
                    </Pressable>

                    <Pressable onPress={() => {
                        LoopAudio();
                    }}>
                        <Image style={{
                            width: 45,
                            height: 45,
                            resizeMode: "contain"
                        }}
                            source={isLoop ? require("../assets/loop-on.png") : require("../assets/loop-off.png")} />
                    </Pressable>

                </View>
            </View>
        </View>

    )

}