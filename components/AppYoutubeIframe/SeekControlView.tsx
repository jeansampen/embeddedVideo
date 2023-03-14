import React, {
    forwardRef,
    useRef,
    useEffect,
    useImperativeHandle,
  } from "react";
  import { View, Image, StyleSheet, Animated, Text, Platform, GestureResponderEvent } from "react-native";
  
  const DELAY_DOUBLE_CLICK = 500;

  const SeekControlView = (props: any, ref: any) => {

    const timeTouchRef = useRef(0)
    const onTouchStartLeft = (eve: GestureResponderEvent) => {
      
      const delay = Date.now() - timeTouchRef.current;
      if (delay < DELAY_DOUBLE_CLICK) {
        props.onDbClickLeft?.(eve)
      } 
      timeTouchRef.current = Date.now();
    };

    const onTouchStartRight = (eve: GestureResponderEvent) => {
      
      const delay = Date.now() - timeTouchRef.current;
      if (delay < DELAY_DOUBLE_CLICK) {
        props.onDbClickRight?.(eve)
      } 
      timeTouchRef.current = Date.now();
    };

  const onTouchMove = (eve: GestureResponderEvent) => {};

  const onTouchEnd = (eve: GestureResponderEvent) => {};
    return (
      <View style={styles.container} pointerEvents={"box-none"}>
        <View
          style={[
            styles.sideView,
            styles.sideLeftView,
          ]}
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
          onResponderGrant={Platform.OS === "ios" ? onTouchStartLeft : undefined}
          onResponderMove={Platform.OS === "ios" ? onTouchMove : undefined}
          onResponderRelease={Platform.OS === "ios" ? onTouchEnd : undefined}
        >
        </View>
        <View pointerEvents="none" style={styles.centerView}></View>
        <View
          style={[
            styles.sideView,
            styles.sideRightView,
          ]}
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
          onResponderGrant={Platform.OS === "ios" ? onTouchStartRight : undefined}
          onResponderMove={Platform.OS === "ios" ? onTouchMove : undefined}
          onResponderRelease={Platform.OS === "ios" ? onTouchEnd : undefined}
        >
        </View>
      </View>
    );
  };
  
  export default forwardRef(SeekControlView);
  
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 60,
      flexDirection: "row",
    },
    sideView: {
      width: "25%",
      height: "100%",
      justifyContent: 'center',
      alignItems: 'center',
    },
    sideLeftView: {
     
    },
    sideRightView: {
    },
    textContent: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '700',
    },
    centerView: {
      width: "50%",
      height: "100%",
    },
  });
  