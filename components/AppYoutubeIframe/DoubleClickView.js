import React, { forwardRef, useRef, useEffect, useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";

const DEFAULT_DELAY_DURATION = 300;
const DEFAULT_RADIUS = 20;

const DoubleClickView = (props, ref) => {

    const prevTouchInfoRef = useRef({
        prevTouchX: 0,
        prevTouchY: 0,
        prevTouchTimeStamp: 0,
      });

      const [isTerminated, setTerminated] = useState(false);
      const [touchStartTime, setTouchStartTime] = useState(0);
      const [lastTap, setLastTap] = useState(0);
    
      const [longPressTimer, setLongPressTimer] = useState(0);
      const [singlePressTimer, setSinglePressTimer] = useState(0);
    
      const DOUBLE_PRESS_DELAY = 400;
      const LONG_PRESS_DELAY = 700;
    
      const cancelLongPressTimer = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(0);
        }
      };
    
      const cancelSinglePressTimer = () => {
        if (singlePressTimer) {
          clearTimeout(singlePressTimer);
          setSinglePressTimer(0);
        }
      };
    
      const handleTap = (event, gestureState) => {
        cancelSinglePressTimer();
    
        const timeNow = Date.now();
        if (lastTap && timeNow - lastTap < DOUBLE_PRESS_DELAY) {
          console.log('Handle double press');
        } else {
          setLastTap(timeNow);
    
          const timeout = setTimeout(() => {
            setLastTap(0);
            console.log('Handle single press');
          }, DOUBLE_PRESS_DELAY);
    
          setSinglePressTimer(timeout);
        }
      };
    
      const handlePressOut = (event, gestureState) => {
        const elapsedTime = Date.now() - touchStartTime;
        if (elapsedTime > LONG_PRESS_DELAY) {
          console.log('Handle long press');
        } else {
          handleTap(event, gestureState); // handles the single or double click
        }
        setTouchStartTime(0);
      };

    const handlePanResponderGrant = (evt, gestureState) => {
        console.log('on handlePanResponderGrant');
        const currentTouchTimeStamp = Date.now();
    
        if (isDoubleTap(currentTouchTimeStamp, gestureState)) {
          props.onDbClick?.(evt, gestureState);
        }
    
        prevTouchInfoRef.current = {
          prevTouchX: gestureState.x0,
          prevTouchY: gestureState.y0,
          prevTouchTimeStamp: currentTouchTimeStamp,
        };
      }

    const distance = (x0, y0, x1, y1) => {
      return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }
    
    const isDoubleTap = (currentTouchTimeStamp, {x0, y0}) => {
      const {prevTouchX, prevTouchY, prevTouchTimeStamp} = prevTouchInfoRef.current;
      const dt = currentTouchTimeStamp - prevTouchTimeStamp;
      const delay = props.delay || DEFAULT_DELAY_DURATION;
      const radius = props.radius || DEFAULT_RADIUS;
    
      return dt < delay && distance(prevTouchX, prevTouchY, x0, y0) < radius;
    }

    const responder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
    
        onPanResponderStart: () => {
          cancelLongPressTimer();
    
          const timeout = setTimeout(() => {
            if (!isTerminated) {
              setTouchStartTime(Date.now());
            }
          });
    
          setLongPressTimer(timeout);
        },
    
        onPanResponderRelease: (event, gestureState) => {
          handlePressOut(event, gestureState);
        },
    
        onPanResponderTerminate: () => {
          setTerminated(true);
        },
      });

    return (
        <View {...props} 
            {...responder.panHandlers}>
            {props.children}
        </View>
    );
};

export default forwardRef(DoubleClickView);

const styles = StyleSheet.create({
});
