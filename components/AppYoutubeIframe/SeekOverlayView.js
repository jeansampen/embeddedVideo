import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { View, Image, StyleSheet, Animated, Text } from "react-native";
import { useHover } from "react-native-web-hooks";

const SeekOverlayView = (props, ref) => {
  const animatedLeftValue = useRef(new Animated.Value(0)).current;
  const animatedRightValue = useRef(new Animated.Value(0)).current;

  useImperativeHandle(
    ref,
    () => ({
      //side: 0: 'left' or 1: 'right'
      onDoAnimation: (side) => {
        var animatedValue = null;
        if (side === 0) {
          animatedValue = animatedLeftValue;
        } else if (side === 1) {
          animatedValue = animatedRightValue;
        }
        if (!animatedValue) {
          return;
        }
        Animated.timing(animatedValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start((endResult) => {
          if (endResult?.finished === true) {
            setTimeout(() => {
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }).start();
            }, 100);
          }
        });
      },
    }),
    []
  );

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        pointerEvents="none"
        style={[
          styles.sideView,
          styles.sideLeftView,
          {
            opacity: animatedLeftValue,
          },
        ]}
      >
        <Text style={styles.textContent}>- 5</Text>
      </Animated.View>
      <View pointerEvents="none" style={styles.centerView}></View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.sideView,
          styles.sideRightView,
          {
            opacity: animatedRightValue,
          },
        ]}
      >
        <Text style={styles.textContent}>+ 5</Text>
      </Animated.View>
    </View>
  );
};

export default forwardRef(SeekOverlayView);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  sideView: {
    width: "40%",
    height: "100%",
    backgroundColor: "#ffffff4D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideLeftView: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  sideRightView: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  textContent: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  centerView: {
    width: "20%",
    height: "100%",
  },
});
