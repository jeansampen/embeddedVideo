import React from "react";
import { Button, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { IOverlayProps } from "./types";

const OverlayView = (props: IOverlayProps) => {
  
  if (!props.isPause && props.isPlayed) {
    return <></>;
  }
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress} activeOpacity={1}>
      {(props.isPause) && (
        <>
          <Image style={styles.bgImage} source={props.imageSource} />
          <View style={[styles.container, styles.centerItems]}>
            <Image style={styles.btnImage} source={props.btnSource} />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

export default OverlayView;
export type { IOverlayProps };

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  },
  bgImage: { width: "100%", height: "100%", resizeMode: "stretch" },
  btnImage: { width: 50, height: 50, resizeMode: "stretch" },
  centerItems: { alignItems: "center", justifyContent: "center" },
});
