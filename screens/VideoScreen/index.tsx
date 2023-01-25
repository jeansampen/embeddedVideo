// navigation
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View, StyleSheet, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import YoutubePlayer from "react-native-youtube-iframe";
import { useCallback, useState } from 'react';
import React from 'react';
import OverlayView from './components/OverlayView';
import AppYoutubePlayerView from './components/AppYoutubePlayerView';

type Props = NativeStackScreenProps<RootStackParamList, 'Video'>;

export const VideoScreen: React.FC<Props> = (props) => {
    const videoWidth = Platform.OS === "web" ? 500 : Dimensions.get("window").width;
    // YoutubePlayer recommend 16:9
    const videoHeight = videoWidth / 16 * 9; 

    return (
        <View style={styles.container}>
            <AppYoutubePlayerView 
                videoId={props.route.params.VideoUrl} 
                width={videoWidth} 
                height={videoHeight} 
                pausingBgSource={{uri: 'https://mixkit.imgix.net/videos/preview/mixkit-blue-bubbles-295-0.jpg?q=80&auto=format%2Ccompress&w=460'}}
                pausingIconSource={{uri: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c4f9.png'}}
                />
        </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });