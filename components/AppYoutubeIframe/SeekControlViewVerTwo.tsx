import React, {
    forwardRef,
    useRef,
    useEffect,
    useImperativeHandle,
  } from "react";
  import { View, Image, StyleSheet, Animated, Text, Platform, GestureResponderEvent, TouchableOpacity } from "react-native";
  
  const DELAY_DOUBLE_CLICK = 500;

  const SeekControlView = (props: any, ref: any) => {

    const onTouchStart = (eve: GestureResponderEvent) => {};

  const onTouchMove = (eve: GestureResponderEvent) => {};

  const onTouchEnd = (eve: GestureResponderEvent) => {};
    return (
      <View style={styles.container} pointerEvents={"box-none"}>
        <TouchableOpacity
          style={[
            styles.sideView,
            styles.sideLeftView,
          ]}
          onPress={() => {console.log('on press 1')}}
        >
        </TouchableOpacity>
        <View pointerEvents="none" style={styles.centerView}></View>
        <TouchableOpacity
          style={[
            styles.sideView,
            styles.sideRightView,
          ]}
          onPress={() => {console.log('on press 2')}}
        >
        </TouchableOpacity>
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
      backgroundColor: '#00ff004D',
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
  