import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { Platform, Pressable, StyleSheet, TouchableOpacity, TouchableNativeFeedback, View } from "react-native";
import { EventEmitter } from "events";
import { WebView } from "./WebView";
import {
  PLAYER_ERROR,
  PLAYER_STATES,
  CUSTOM_USER_AGENT,
  PLAYER_STATES_NAMES,
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
import { HandleTouchView } from "expo-handle-touch-view";


const AppYoutubeIframe = (props, ref) => {
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
    onUpdateVisibilityPauseOverlay = (visible) => {},
    onError = (_err) => {},
    onReady = (_event) => {},
    onPlayerPlayed = () => {},
    playListStartIndex = 0,
    initialPlayerParams,
    allowWebViewZoom = false,
    forceAndroidAutoplay = false,
    onChangeState = (_event) => {},
    onFullScreenChange = (_status) => {},
    onPlaybackQualityChange = (_quality) => {},
    onPlaybackRateChange = (_playbackRate) => {},
  } = props;

  const [playerReady, setPlayerReady] = useState(false);
  const [playerOverlayVisible, setplayerOverlayVisible] = useState(false);
  const lastVideoIdRef = useRef(videoId);
  const lastPlayListRef = useRef(playList);
  const initialPlayerParamsRef = useRef(initialPlayerParams || {});
  const overlayRef = useRef(null);
  const isFirstTimePlay = useRef(false);

  const webViewRef = useRef(null);
  const eventEmitter = useRef(new EventEmitter());

  const isStartTouchRef = useRef(false);
  const isMoveTouchRef = useRef(false);
  const isEndTouchRef = useRef(false);
  const timeStartMoveRef = useRef(0);
  const currentTimeOutDurationRef = useRef(0);
  const timeoutRef = useRef(null);

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
      seekTo: (seconds, allowSeekAhead) => {
        injectJavaScript(
          PLAYER_FUNCTIONS.seekToScript(seconds, allowSeekAhead)
        );
      },
      pausePlayer: () => {
        injectJavaScript(PLAYER_FUNCTIONS.pauseVideo);
      },
      playPlayer: () => {
        injectJavaScript(PLAYER_FUNCTIONS.playVideo);
        if(!isFirstTimePlay.current){
          setplayerOverlayVisible(true);
        }
      },
    }),
    []
  );

  const injectJavaScript = (command) => {
    if (Platform.OS === "web") {
      webViewRef.current.frameRef.contentWindow.eval(command);
    } else {
      webViewRef.current.injectJavaScript(command);
    }
  };

  useEffect(() => {
    if (!playerReady) {
      // no instance of player is ready
      return;
    }
    const playVideoScripts = [
      playMode[play],
      soundMode[mute],
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
    (event) => {
      try {
        console.log('onWebMessage: ', event.nativeEvent);
        const message = JSON.parse(event.nativeEvent?.data || "");
        
        if (!message.eventType) {
          return;
        }
        switch (message.eventType) {
          case "fullScreenChange":
            onFullScreenChange(message.data);
            break;
          case "playerStateChange":
            if (
              !isFirstTimePlay.current &&
              PLAYER_STATES[message.data] === PLAYER_STATES_NAMES.PLAYING
            ) {
              onPlayerPlayed?.();
              showPlayerOverlay(2750);
              isFirstTimePlay.current = true;
            }
            if(PLAYER_STATES[message.data] === PLAYER_STATES_NAMES.PLAYING){
              onUpdateVisibilityPauseOverlay?.(false);
            }
            else if(PLAYER_STATES[message.data] === PLAYER_STATES_NAMES.PAUSED){
              if(isMoveTouchRef.current){
                onUpdateVisibilityPauseOverlay?.(false);
              }
              else { 
                onUpdateVisibilityPauseOverlay?.(true);
              }
            }
            else if(PLAYER_STATES[message.data] === PLAYER_STATES_NAMES.ENDED){
              injectJavaScript(PLAYER_FUNCTIONS.pauseVideo);
              injectJavaScript(
                PLAYER_FUNCTIONS.seekToScript(0, true)
              );
              isFirstTimePlay.current = false;
              onUpdateVisibilityPauseOverlay?.(true);
            }
            onChangeState(PLAYER_STATES[message.data]);
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
            onError(PLAYER_ERROR[message.data]);
            break;
          case "playbackRateChange":
            onPlaybackRateChange(message.data);
            break;
          default:
            eventEmitter.current.emit(message.eventType, message.data);
            break;
        }
      } catch (error) {
        console.warn("[rn-youtube-iframe]", error);
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
    (request) => {
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

  if(Platform.OS === "web"){
    const isHoveredPlayer = useHover(webViewRef);
    const checkHoverInterval = useRef(null);

    useEffect(() => {
      if(isHoveredPlayer && !playerOverlayVisible){
        setplayerOverlayVisible(true);
        checkHoverInterval.current = setInterval(() => {
          setplayerOverlayVisible(false);
          clearInterval(checkHoverInterval.current);
          checkHoverInterval.current = null;
        }, 3000);
      }
    }, [isHoveredPlayer]);
  }

  const showPlayerOverlay = (timeout) => {
    const timeoutDefault = Platform.OS === "android" ? 3250 : 4250;
    currentTimeOutDurationRef.current = timeout || timeoutDefault;
    setplayerOverlayVisible(true);
    timeoutRef.current = setTimeout(() => {
      if(!isMoveTouchRef.current){
        setplayerOverlayVisible(false);
      }
    }, currentTimeOutDurationRef.current);
  }

  const onPlayerTap = (evt) => {
    if(Platform.OS === "ios" || Platform.OS === "android"){
      if(!playerOverlayVisible){
        showPlayerOverlay();
      }
    }
  }

  const onTouchStart = (eve) => {
    console.log('onTouchStart');
    eve.preventDefault();
    timeStartMoveRef.current = Date.now();
    isStartTouchRef.current = true;
    isMoveTouchRef.current = false;
    isEndTouchRef.current = false;
    if(!playerOverlayVisible){
      onPlayerTap();
    }
  }

  const onTouchMove = (eve) => {
    console.log('onTouchMove');
    eve.preventDefault();
    isStartTouchRef.current = false;
    isMoveTouchRef.current = true;
    isEndTouchRef.current = false;
    if(playerOverlayVisible && timeoutRef.current){
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  const onTouchEnd = (eve) => {
    console.log('onTouchEnd');
    eve.preventDefault();
    isStartTouchRef.current = false;
    isMoveTouchRef.current = false;
    isEndTouchRef.current = true;

    if(playerOverlayVisible){
      const durationMoveSec = (Date.now() - timeStartMoveRef.current);
      if(durationMoveSec > currentTimeOutDurationRef.current){
        setplayerOverlayVisible(false);
      }
      else {
        if(timeoutRef.current){
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setplayerOverlayVisible(false);
        }, currentTimeOutDurationRef.current - durationMoveSec);
      }
      
    }
    timeStartMoveRef.current = 0;
    
  }
  

  return (
    <View
      style={{ height, width}}
      // onStartShouldSetResponderCapture={(evt) => { evt.preventDefault(); console.log('onStartShouldSetResponderCapture'); return false; }}
      // onMoveShouldSetResponderCapture={(evt) => { evt.preventDefault(); console.log('onMoveShouldSetResponderCapture'); return true; }}
      // onShouldBlockNativeResponder={(evt) => { evt.preventDefault(); console.log('onShouldBlockNativeResponder'); return false; }}
      // onStartShouldSetPanResponderCapture={(evt) => { evt.preventDefault(); console.log('onStartShouldSetPanResponderCapture'); return false; }}
      // onResponderGrant={onTouchStart}
      // onResponderMove={onTouchMove}
      // onResponderReject={onTouchEnd}
      // onResponderRelease={onTouchEnd}
      >
    <HandleTouchView
      onTouch={(evt) => {
        console.log('on touch: ' + evt.nativeEvent.type);
        if(evt.nativeEvent.type == "0") {
          onTouchStart(evt);
        }
        else if(evt.nativeEvent.type == "1") {
          onTouchEnd(evt);
        }
        else if(evt.nativeEvent.type == "2") {
          onTouchMove(evt);
        }
      }}
      style={{width: '100%', height: '100%', backgroundColor: 'green'}}>
        
      <WebView
          bounces={false}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback
          style={[styles.webView, webViewStyle]}
          mediaPlaybackRequiresUserAction={false}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          allowsFullscreenVideo={
            !initialPlayerParamsRef.current.preventFullScreen
          }
          userAgent={
            forceAndroidAutoplay
              ? Platform.select({ android: CUSTOM_USER_AGENT, ios: "" })
              : ""
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
      {playerOverlayVisible && <View style={[styles.overlay, {top: height/2 - 25, left: width/2 - 25}]}>
        <PlayerOverlayView visible={playerOverlayVisible} ref={overlayRef} />
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  webView: { backgroundColor: "transparent", width: '100%', height: '100%' },
  overlay: {
    position: "absolute",
    margin: 'auto',
    zIndex: 1,
    backgroundColor: '#ffffff',
    width: 50, 
    height: 50,
    borderRadius: 10,
  },
  hiddenTouchOverlay: {
    position: "absolute",
    margin: 'auto',
    left: 0, 
    top: 0,
    right: 0,
    bottom: 0,
  }
});

export default forwardRef(AppYoutubeIframe);
