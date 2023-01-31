
import React, { useRef } from 'react';
import { View, Platform } from 'react-native';
import { YoutubeIframeProps } from 'react-native-youtube-iframe';
import YoutubePlayer from "react-native-youtube-iframe";
import { useCallback } from 'react';
import OverlayView from '../OverlayView';
import { useState } from 'react';
import { IAppYoutubeIframePropsProps } from './types';
import AppYoutubeIframe from '../../../../components/AppYoutubeIframe/AppYoutubeIframe';

const AppYoutubePlayerView = (props: IAppYoutubeIframePropsProps, ref?: any) => {
    const [isPause, setIsPause] = useState<boolean>(true);
    const [initVideo, setInitVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlayed, setIsPlayed] = useState(false);
    const onStateChange = useCallback((state: string) => {
        
        if(isPlayed){
            if(state === "paused") {
                setIsPause(true);
                setIsPlaying(false);
            }
            else if(state === "playing") {
                setIsPause(false);
                setIsPlaying(true);
            }
        }
        props.onChangeState?.(state);
    }, [isPlayed]); 

    const onPlayerReady = useCallback((evt: any) => {
        setIsPlayerReady(true);
    }, []);

    const onFullScreenChange = useCallback((status: boolean) => {
        console.log('is full screen: ' + status);
    }, []);

    const onPlayerPlayed = useCallback(() => {
        setIsPlayed(true);
    }, []);

    const playerRef = useRef<any>();

    const onToggleVideo = () => {
        if(!isPlayed){
            if(isPause){
                playerRef.current?.playPlayer();
            }
            else {
                playerRef.current?.pausePlayer();
            }
            setIsPause(prev => {
                return !prev;
            });
            if(!initVideo){
                setInitVideo(true);
            }
        }
        else {
            setIsPlaying(prev => !prev);
        }
    };

    return (
        <View style={{ position: 'relative', width: props.width, height: props.height}}>
            <AppYoutubeIframe
                ref={playerRef}
                {...props}
                play={isPlaying}
                onChangeState={onStateChange}
                onReady={onPlayerReady}
                initialPlayerParams={{
                    preventFullScreen: true,
                }}
                onPlayerPlayed={onPlayerPlayed}
                forceAndroidAutoplay={true}
                webViewStyle={{display: isPlayerReady ? 'flex' : 'none'}}
            />
            {/* {isPlayerReady && <OverlayView 
                isPause={isPause || false}
                isPlayed={isPlayed}
                onPress={onToggleVideo}
                imageSource={props.pausingBgSource}
                btnSource={props.pausingIconSource} />} */}
        </View>
    );
};

export default React.memo(React.forwardRef(AppYoutubePlayerView));
export type { IAppYoutubeIframePropsProps };
