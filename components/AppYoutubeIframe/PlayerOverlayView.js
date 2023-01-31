import React, { forwardRef, useRef, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useHover } from 'react-native-web-hooks';

const PlayerOverlayView = (props, ref) => {
    if(!props.visible){
        return <View></View>
    }
    return (
        <View style={{width: '100%', height: '100%'}}>
            <TouchableOpacity style={[styles.centerItems]}>
                <Image style={styles.btnImage} source={{
                    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACNUlEQVR4nO2ZsWsUQRTGH0juvSURxbs3h5JOxcLCxt7OxlZImT61CEZL/wMhhWUaIYiNnVoZLAXBQiz8AxLZkEQxuTfBkTmTYMju7cyu2Zk59oOplhnmN++b97G7AJ06pSWF+oMibexgkhGTvBvOjG5CalKHECcGyhbPjG5B8iBkq6O/DcHMQuogajzkCUwDCKPk82AySL8i2gzpYAGmAUShrMJUgJD+CvHLnKsCYZKfELsGPX2vuiKyDbGLUV45WOsTxCw1a4aKRKqtpZ9DzGKShw7VMEwHixCzFOkvDvfjdz8zVyBWDUjuuFRDof4IMUuhrDrZCvXTM9yEXnc6zZMnu340/wKYi0zyy3sN7yG7tiv2e/s3ikFIftRZ+Gg+oyydPYT+p6qSX8rM/CkQJv25CYj1fZsgauwIWSsAkdeNQNqGoLHNdgqspZ+lBsIoeVFFHqQGogqtlen7SYGgbDHuXTsF0s/kdkogjPouFOnynBmkBSIvCkH+bkZ2EwLZLAWpkyUBQfIJIP5ZEvCyr02wln+WBAHBko7VJEtCgHBZx2qSJWFApLxj1c2SQCCbE0HqZEmUIHXeS6K0Vp0saRuEUTYY965ClcqyhEke2R80imQ5FAiTvHWCmJQlDGbOPu+DOR8MBB0sVZ0lsmxhFMnjgCDf3UE8s6RNEOXz4ds3S1oFQXnpDOKbJU0/XnjYKh/09q87gxxu6o3bCen3x3PG90evWB//Zzvt2Ep4Q3Tq1Gk69Qf0icdwrD2utQAAAABJRU5ErkJggg==',
                }} />
            </TouchableOpacity>
        </View>
    );
};

export default forwardRef(PlayerOverlayView);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    margin: 'auto',
    zIndex: 1,
    backgroundColor: '#ffffff',
    width: 50, 
    height: 50,
  },
  bgImage: { width: "100%", height: "100%", resizeMode: "stretch" },
  btnImage: { width: 26, height: 26, resizeMode: "stretch" },
  centerItems: { alignItems: "center", justifyContent: "center", width: '100%', height: '100%' },
});
