
import React, { useRef } from 'react';
import { View, Platform } from 'react-native';
import { YoutubeIframeProps } from 'react-native-youtube-iframe';
import YoutubePlayer from "react-native-youtube-iframe";
import { useCallback } from 'react';
import OverlayView from '../OverlayView';
import { useState } from 'react';
import { IAppYoutubeIframePropsProps } from './types';
import AppYoutubeIframe from '../../../../components/AppYoutubeIframe/AppYoutubeIframe';

const DELAY_TIME_TO_CHANGE_PLAY_STATE = 1000;

const AppYoutubePlayerView = (props: IAppYoutubeIframePropsProps, ref?: any) => {
    const [isPause, setIsPause] = useState<boolean>(true);
    const [currentTouchAction, setCurrentTouchAction] = useState<Number>(0);
    const [isPauseOverlayVisible, setIsPauseOverlayVisible] = useState<boolean>(true);
    const [initVideo, setInitVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlayed, setIsPlayed] = useState(false);

    const timeOutPauseOverlayVisibleRef = useRef<any>(null);

  const timeOutDelayVideoTapRef = useRef(0);

    const onStateChange = useCallback((state: string) => {
        
        if(isPlayed){

            if(state === "paused") {
                if(Date.now() - timeOutDelayVideoTapRef.current > DELAY_TIME_TO_CHANGE_PLAY_STATE){
                    setIsPause(true);
                    setIsPlaying(false);
                    timeOutDelayVideoTapRef.current = Date.now();
                }
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
                onUpdateVisibilityPauseOverlay(true);
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

    const onPlayVideo = () => {
        setIsPause(false);
        if(!initVideo){
            setInitVideo(true);
        }
        playerRef.current?.playPlayer();
        setIsPauseOverlayVisible(false);
    }

    const onUpdateVisibilityPauseOverlay = (isVisible: boolean) => {
        clearTimeout(timeOutPauseOverlayVisibleRef.current);
        if(timeOutPauseOverlayVisibleRef.current != null){
            timeOutPauseOverlayVisibleRef.current = null;
        }
        else {
            timeOutPauseOverlayVisibleRef.current = setTimeout(() => {
                setIsPauseOverlayVisible(isVisible);
                timeOutPauseOverlayVisibleRef.current = null;
            }, 800);
        }
    }

    const onCurrentTouchAction = (actionId: Number) => {
        setCurrentTouchAction(actionId);
    }

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
                onCurrentTouchAction={onCurrentTouchAction}
                onUpdateVisibilityPauseOverlay={onUpdateVisibilityPauseOverlay}
                onPlayerPlayed={onPlayerPlayed}
                forceAndroidAutoplay={true}
                webViewStyle={{display: isPlayerReady ? 'flex' : 'none'}}
            />
            {isPlayerReady && isPauseOverlayVisible && currentTouchAction !== 2 && currentTouchAction !== 1 && <OverlayView 
                onPress={onPlayVideo}
                imageSource={props.pausingBgSource}
                btnSource={props.pausingIconSource} />}
        </View>
    );
};

export default React.memo(React.forwardRef(AppYoutubePlayerView));
export type { IAppYoutubeIframePropsProps };
