import React, { forwardRef, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useHover } from "react-native-web-hooks";

const DisableControlOverlayView = (props, ref) => {
  const onTouchStart = (eve) => {};

  const onTouchMove = (eve) => {};

  const onTouchEnd = (eve) => {};
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View
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
        style={[styles.disableTitle, { width: props.width }]}
      ></View>
      <View
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
        style={styles.disableBottom}
      ></View>
      <View
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
        style={styles.disableBottomIcon}
      ></View>
    </View>
  );
};

export default forwardRef(DisableControlOverlayView);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  disableTitle: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 60,
    zIndex: 9999,
  },
  disableBottom: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 165,
    height: Platform.OS === "ios" ? 50 : 40,
    zIndex: 9999,
  },
  disableBottomIcon: {
    position: "absolute",
    right: 0,
    bottom: Platform.OS === "ios" ? 55 : 45,
    width: 60,
    height: 50,
    zIndex: 9999,
  },
});
