
import React from 'react';
import { View } from 'react-native';
import { YoutubeIframeProps } from 'react-native-youtube-iframe';
import YoutubePlayer from "react-native-youtube-iframe";
import { useCallback } from 'react';
import OverlayView from '../OverlayView';
import { useState } from 'react';
import { IAppYoutubeIframePropsProps } from './types';
import AppYoutubeIframe from '../../../../components/AppYoutubeIframe/AppYoutubeIframe';

const AppYoutubePlayerView = (props: IAppYoutubeIframePropsProps, ref?: any) => {
    const [isPause, setIsPause] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const onStateChange = useCallback((state: string) => {
        setIsPlaying(state === "playing");
        if(state === "paused") {
            setIsPause(true);
        }
        else if(state === "playing") {
            setIsPause(false);
        }
        props.onChangeState?.(state);
    }, []); 

    const onFullScreenChange = useCallback((status: boolean) => {
        console.log('is full screen: ' + status);
    }, []);

    

    const onPlayVideo = () => {
        setIsPlaying((prev) => !prev);
    };

    return (
        <View style={{ position: 'relative', width: props.width, height: props.height}}>
            <AppYoutubeIframe
                ref={ref}
                {...props}
                play={isPlaying}
                onChangeState={onStateChange}
                initialPlayerParams={{
                    preventFullScreen: true,
                }}
            />
            <OverlayView 
                visible={isPause} 
                onPress={onPlayVideo}
                imageSource={props.pausingBgSource}
                btnSource={props.pausingIconSource} />
        </View>
    );
};

export default React.memo(React.forwardRef(AppYoutubePlayerView));
export type { IAppYoutubeIframePropsProps };