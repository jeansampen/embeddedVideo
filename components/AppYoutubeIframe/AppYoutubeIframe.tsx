import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
  lazy,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  PixelRatio,
  GestureResponderEvent,
} from "react-native";
import { EventEmitter } from "events";
import {
  CUSTOM_USER_AGENT,
  PLAYER_STATE_PLAYING_INDEX,
  PLAYER_STATE_PAUSED_INDEX,
  PLAYER_STATE_ENDED_INDEX,
  onGetStateName,
  onGetError,
  PLAYER_STATE_BUFFERING_INDEX,
  PLAYER_STATE_VIDEO_CUED_INDEX,
  PLAYER_STATE_UNSTARTED_INDEX,
} from "./constants";
import {
  playMode,
  soundMode,
  MAIN_SCRIPT,
  PLAYER_FUNCTIONS,
} from "./PlayerScripts";
import { deepComparePlayList } from "./utils";
import { useHover, useFocus, useActive } from "react-native-web-hooks";
import PlayerOverlayView from "./PlayerOverlayView";
import DisableControlOverlayView from "./DisableControlOverlayView";
import SeekOverlayView from "./SeekOverlayView";
import WebView from "./WebView";
import DoubleTapView from "../DoubleTapView";
import SeekControlView from "./SeekControlViewVerTwo";

let HandleTouchView: any;

try {
  HandleTouchView = require("expo-handle-touch-view").HandleTouchView;
} catch {
  HandleTouchView = View;
}

const AppYoutubeIframe = (props: any, ref: any) => {
  const {
    height,
    width,
    videoId,
    playList,
    play = false,
    mute = false,
    volume = 100,
    webViewStyle,
    webViewProps,
    useLocalHTML,
    baseUrlOverride,
    playbackRate = 1,
    contentScale = 1.0,
    onUpdateVisibilityPauseOverlay = (visible: boolean) => {},
    onError = (_err: any) => {},
    onReady = (_event: any) => {},
    onPlayerPlayed = () => {},
    onCurrentTouchAction = (actionId: any) => {},
    playListStartIndex = 0,
    initialPlayerParams,
    allowWebViewZoom = false,
    forceAndroidAutoplay = false,
    onChangeState = (_event: any) => {},
    onFullScreenChange = (_status: any) => {},
    onPlaybackQualityChange = (_quality: any) => {},
    onPlaybackRateChange = (_playbackRate: any) => {},
  } = props;

  const [playerReady, setPlayerReady] = useState(false);
  const [playerOverlayVisible, setplayerOverlayVisible] = useState(false);
  const [seekControlViewVisible, setSeekControlViewVisible] = useState(false);
  const lastVideoIdRef = useRef(videoId);
  const lastPlayListRef = useRef(playList);
  const initialPlayerParamsRef = useRef(initialPlayerParams || {});
  const overlayRef = useRef(null);
  const isFirstTimePlay = useRef(false);
  const videoDurationRef = useRef<number>(0);
  const touchMoveTimeRef = useRef<number>(0);

  const webViewRef = useRef<any | null>(null);
  const seekOverlayViewRef = useRef<any>(null);
  const eventEmitter = useRef(new EventEmitter());

  const isStartTouchRef = useRef(false);
  const isMoveTouchRef = useRef(false);
  const isEndTouchRef = useRef(false);
  const timeStartMoveRef = useRef(0);
  const currentTimeOutDurationRef = useRef(0);
  const timeoutRef = useRef<any>(null);

  const touchCount = useRef<number>(0);

  const DELAY_NORMAL_CLICK = 500;
  const DELAY_DOUBLE_CLICK = 500;
  const previousStartTouchRef = useRef(null);
  const previousEndTouchRef = useRef(null);
  const currentStartTouchRef = useRef(null);
  const currentEndTouchRef = useRef(null);
  const timeTouchRef = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      getVideoUrl: () => {
        injectJavaScript(PLAYER_FUNCTIONS.getVideoUrlScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("getVideoUrl", resolve);
        });
      },
      getDuration: () => {
        injectJavaScript(PLAYER_FUNCTIONS.durationScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("getDuration", resolve);
        });
      },
      getCurrentTime: () => {
        injectJavaScript(PLAYER_FUNCTIONS.currentTimeScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("getCurrentTime", resolve);
        });
      },
      isMuted: () => {
        injectJavaScript(PLAYER_FUNCTIONS.isMutedScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("isMuted", resolve);
        });
      },
      getVolume: () => {
        injectJavaScript(PLAYER_FUNCTIONS.getVolumeScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("getVolume", resolve);
        });
      },
      getPlaybackRate: () => {
        injectJavaScript(PLAYER_FUNCTIONS.getPlaybackRateScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("getPlaybackRate", resolve);
        });
      },
      getAvailablePlaybackRates: () => {
        injectJavaScript(PLAYER_FUNCTIONS.getAvailablePlaybackRatesScript);
        return new Promise((resolve) => {
          eventEmitter.current.once("getAvailablePlaybackRates", resolve);
        });
      },
      seekTo: (seconds: number, allowSeekAhead: boolean) => {
        injectJavaScript(
          PLAYER_FUNCTIONS.seekToScript(seconds, allowSeekAhead)
        );
      },
      pausePlayer: () => {
        injectJavaScript(PLAYER_FUNCTIONS.pauseVideo);
      },
      playPlayer: () => {
        injectJavaScript(PLAYER_FUNCTIONS.playVideo);
        if (!isFirstTimePlay.current) {
          setplayerOverlayVisible(true);
        }
      },
    }),
    []
  );

  const injectJavaScript = (command: string) => {
    if (Platform.OS === "web") {
      webViewRef?.current?.frameRef.contentWindow.eval(command);
    } else {
      webViewRef?.current?.injectJavaScript(command);
    }
  };

  useEffect(() => {
    if (!playerReady) {
      // no instance of player is ready
      return;
    }
    const playVideoScripts = [
      play ? playMode.PLAY_MODE : playMode.PAUSE_MODE,
      mute ? soundMode.MUTE_MODE : soundMode.UNMUTE_MODE,
      PLAYER_FUNCTIONS.setVolume(volume),
      PLAYER_FUNCTIONS.setPlaybackRate(playbackRate),
    ];
    playVideoScripts.forEach((ele) => {
      injectJavaScript(ele);
    });
  }, [play, mute, volume, playbackRate, playerReady]);

  useEffect(() => {
    if (!playerReady || lastVideoIdRef.current === videoId) {
      // no instance of player is ready
      // or videoId has not changed
      return;
    }

    lastVideoIdRef.current = videoId;

    injectJavaScript(PLAYER_FUNCTIONS.loadVideoById(videoId, play));
  }, [videoId, play, playerReady]);

  useEffect(() => {
    if (!playerReady) {
      // no instance of player is ready
      return;
    }

    // Also, right now, we are helping users by doing "deep" comparisons of playList prop,
    // but in the next major we should leave the responsibility to user (either via useMemo or moving the array outside)
    if (!playList || deepComparePlayList(lastPlayListRef.current, playList)) {
      return;
    }

    lastPlayListRef.current = playList;

    injectJavaScript(
      PLAYER_FUNCTIONS.loadPlaylist(playList, playListStartIndex, play)
    );
  }, [playList, play, playListStartIndex, playerReady]);

  const onWebMessage = useCallback(
    (event: any) => {
      try {
        // console.log('onWebMessage: ', event.nativeEvent);
        const message = JSON.parse(event.nativeEvent?.data || "");

        if (!message.eventType) {
          return;
        }
        const dataNumber: number = message.data;
        switch (message.eventType) {
          case "fullScreenChange":
            onFullScreenChange(message.data);
            break;
          case "seekClick": 
            if(isFirstTimePlay.current){
              if(message.data?.side === "left"){
                console.log('do seek left')
                onSeek(0)
              }
              else if(message.data?.side === "right"){
                console.log('do seek right')
                onSeek(1)
              }
            }
            break;
          case "playerStateChange":
            if (
              !isFirstTimePlay.current &&
              dataNumber == PLAYER_STATE_PLAYING_INDEX
            ) {
              onPlayerPlayed?.();
              showPlayerOverlay(2750);
              isFirstTimePlay.current = true;
              updateVideoDuration();
            }
            if (dataNumber == PLAYER_STATE_PLAYING_INDEX) {
              // console.log("on play state");
              onUpdateVisibilityPauseOverlay?.(false);
            } else if (dataNumber === PLAYER_STATE_PAUSED_INDEX) {
              // console.log("on pause state");
              if (isMoveTouchRef.current) {
                onUpdateVisibilityPauseOverlay?.(false);
              } else {
                onUpdateVisibilityPauseOverlay?.(true);
              }
            } else if (dataNumber === PLAYER_STATE_BUFFERING_INDEX) {
              // console.log("on buffer state");
            } else if (dataNumber === PLAYER_STATE_VIDEO_CUED_INDEX) {
              // console.log("on cued state");
            } else if (dataNumber === PLAYER_STATE_UNSTARTED_INDEX) {
              // console.log("on unstart state");
            } else if (dataNumber === PLAYER_STATE_ENDED_INDEX) {
              injectJavaScript(PLAYER_FUNCTIONS.pauseVideo);
              injectJavaScript(PLAYER_FUNCTIONS.seekToScript(0, true));
              isFirstTimePlay.current = false;
              onUpdateVisibilityPauseOverlay?.(true);
            }
            onChangeState(onGetStateName(dataNumber));
            break;
          case "playerReady":
            onReady();
            setPlayerReady(true);
            onUpdateVisibilityPauseOverlay?.(true);
            break;
          case "playerQualityChange":
            onPlaybackQualityChange(message.data);
            break;
          case "playerError":
            onError(onGetError(dataNumber));
            break;
          case "playbackRateChange":
            onPlaybackRateChange(message.data);
            break;
          default:
            eventEmitter.current.emit(message.eventType, message.data);
            break;
        }
      } catch (error) {
        // console.warn("[rn-youtube-iframe]", error);
      }
    },
    [
      onReady,
      onError,
      onChangeState,
      onFullScreenChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
    ]
  );

  const onShouldStartLoadWithRequest = useCallback(
    (request: any) => {
      try {
        const url = request.mainDocumentURL || request.url;
        const iosFirstLoad = Platform.OS === "ios" && url === "about:blank";
        const shouldLoad = iosFirstLoad || url.startsWith(baseUrlOverride);
        return shouldLoad;
      } catch (error) {
        // defaults to true in case of error
        // returning false stops the video from loading
        return true;
      }
    },
    [baseUrlOverride]
  );

  const source = useMemo(() => {
    const ytScript = MAIN_SCRIPT(
      lastVideoIdRef.current,
      lastPlayListRef.current,
      initialPlayerParamsRef.current,
      allowWebViewZoom,
      contentScale
    );

    const res = { html: ytScript.htmlString };
    return res;
  }, [useLocalHTML, contentScale, baseUrlOverride, allowWebViewZoom]);

  if (Platform.OS === "web") {
    const isHoveredPlayer = useHover(webViewRef);
    const checkHoverInterval = useRef<any>(null);

    useEffect(() => {
      if (isHoveredPlayer && !playerOverlayVisible) {
        setplayerOverlayVisible(true);
        checkHoverInterval.current = setInterval(() => {
          setplayerOverlayVisible(false);
          clearInterval(checkHoverInterval.current);
          checkHoverInterval.current = null;
        }, 3000);
      }
    }, [isHoveredPlayer]);
  }

  const showPlayerOverlay = (timeout?: number) => {
    const timeoutDefault = Platform.OS === "android" ? 3250 : 4250;
    currentTimeOutDurationRef.current = timeout || timeoutDefault;
    setplayerOverlayVisible(true);
    timeoutRef.current = setTimeout(() => {
      if (!isMoveTouchRef.current) {
        setplayerOverlayVisible(false);
      }
    }, currentTimeOutDurationRef.current);
  };

  const onPlayerTap = (evt: any) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      if (!playerOverlayVisible) {
        showPlayerOverlay();
      }
    }
  };

  const onTouchStart = (eve: any) => {
    touchMoveTimeRef.current = 0;
    timeStartMoveRef.current = Date.now();
    isStartTouchRef.current = true;
    isMoveTouchRef.current = false;
    isEndTouchRef.current = false;
    if(isFirstTimePlay.current){
      injectJavaScript(
        PLAYER_FUNCTIONS.toggleSeek(true)
      );
    }
    console.log('on touch start')
    // 1: starting touch
    onCurrentTouchAction?.(1);
    if(!seekControlViewVisible){
      
    }
  };

  const onTouchMove = (eve: any) => {
    isStartTouchRef.current = false;
    isMoveTouchRef.current = true;
    isEndTouchRef.current = false;
    if (playerOverlayVisible && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    touchMoveTimeRef.current += 1;
    // 2: moving touch
    onCurrentTouchAction?.(2);
  };

  const onTouchEnd = (eve: any) => {
    isStartTouchRef.current = false;
    isMoveTouchRef.current = false;
    isEndTouchRef.current = true;

    if (playerOverlayVisible) {
      const durationMoveSec = Date.now() - timeStartMoveRef.current;
      if (durationMoveSec > currentTimeOutDurationRef.current) {
        setplayerOverlayVisible(false);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setplayerOverlayVisible(false);
        }, currentTimeOutDurationRef.current - durationMoveSec);
      }
    }
    timeStartMoveRef.current = 0;
    // 3: end touch
    onCurrentTouchAction?.(3);
    if (touchMoveTimeRef.current > 10) {
      onUpdateVisibilityPauseOverlay?.(false);
    }
  };

  const onGetVideoDuration = () => {
    injectJavaScript(PLAYER_FUNCTIONS.durationScript);
    return new Promise((resolve) => {
      eventEmitter.current.once("getDuration", resolve);
    });
  };

  const onGetVideoCurrentTime = () => {
    injectJavaScript(PLAYER_FUNCTIONS.currentTimeScript);
    return new Promise<number>((resolve) => {
      eventEmitter.current.once("getCurrentTime", resolve);
    });
  };

  const onSeekVideo = (seconds: number) => {
    injectJavaScript(PLAYER_FUNCTIONS.seekToScript(seconds, true));
  };

  const updateVideoDuration = async () => {
    const result = await onGetVideoDuration();
    if (typeof result == "number") {
      videoDurationRef.current = result;
    } else {
      videoDurationRef.current = 0;
    }
  };

  const onSeekRight = (currentPlayerTime: number) => {
    if (currentPlayerTime + 5 > videoDurationRef.current) {
      onSeekVideo(videoDurationRef.current);
    } else {
      onSeekVideo(currentPlayerTime + 5);
    }
    seekOverlayViewRef.current.onDoAnimation(1);
  }

  const onSeekLeft = (currentPlayerTime: number) => {
    if (currentPlayerTime - 5 < 0) {
      onSeekVideo(0);
    } else {
      onSeekVideo(currentPlayerTime - 5);
    }
    seekOverlayViewRef.current.onDoAnimation(0);
  }

  // side: 0 left, 1 right
  const onSeek = async (side: number) => {
    const currentPlayerTime = await onGetVideoCurrentTime();
    if (videoDurationRef.current) {
      if(side === 0){
        onSeekLeft(currentPlayerTime)
      }
      else {
        onSeekRight(currentPlayerTime)
      }
      setTimeout(() => {
        injectJavaScript(PLAYER_FUNCTIONS.playVideo);
      }, 650);
    }
  } 

  return (
    <View style={{ height, width }}>
        <View
          style={{ height, width }}
          onMoveShouldSetResponderCapture={
            Platform.OS === "ios"
              ? (evt) => {
                  return true;
                }
              : undefined
          }
          onStartShouldSetResponderCapture={
            Platform.OS === "ios"
              ? (evt) => {
                  return true;
                }
              : undefined
          }
          onResponderGrant={Platform.OS === "ios" ? onTouchStart : undefined}
          onResponderMove={Platform.OS === "ios" ? onTouchMove : undefined}
          onResponderRelease={Platform.OS === "ios" ? onTouchEnd : undefined}
        >
          <HandleTouchView
            onTouch={(evt: any) => {
              // 0 is start touch
              if (evt.nativeEvent.type == "0") {
                onTouchStart(evt);
              }
              // 1 is end touch
              else if (evt.nativeEvent.type == "1") {
                onTouchEnd(evt);
              }
              // 2 is move touch
              else if (evt.nativeEvent.type == "2") {
                onTouchMove(evt);
              }
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <WebView
              bounces={false}
              originWhitelist={['*']}
              allowsInlineMediaPlayback
              style={[styles.webView, webViewStyle]}
              mediaPlaybackRequiresUserAction={false}
              onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
              allowsFullscreenVideo={
                !initialPlayerParamsRef.current.preventFullScreen
              }
              userAgent={
                forceAndroidAutoplay
                  ? Platform.select({android: CUSTOM_USER_AGENT, ios: ''})
                  : ''
              }
              // props above this are override-able

              // --
              {...webViewProps}
              // --

              // add props that should not be allowed to be overridden below
              source={source}
              ref={webViewRef}
              onMessage={onWebMessage}
            />
          </HandleTouchView>
          {playerOverlayVisible && (
            <View
              style={[
                styles.overlay,
                { top: height / 2 - 25, left: width / 2 - 25 },
              ]}
            >
              <PlayerOverlayView
                visible={playerOverlayVisible}
                ref={overlayRef}
              />
            </View>
          )}
          <SeekOverlayView ref={seekOverlayViewRef} />
        </View>
      <DisableControlOverlayView width={width} height={height} />
    </View>
  );
};

const styles = StyleSheet.create({
  webView: { backgroundColor: "transparent" },
  overlay: {
    position: "absolute",
    margin: "auto",
    zIndex: 1,
    backgroundColor: "#ffffff",
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  hiddenTouchOverlay: {
    position: "absolute",
    margin: "auto",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});

export default forwardRef(AppYoutubeIframe);
