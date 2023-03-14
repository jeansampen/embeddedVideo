import React from "react";
import { GestureResponderEvent, Pressable, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';

interface Props {
  onDoubleTap?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
}

const DELAY_DOUBLE_CLICK = 500;
const DELAY_NORMAL_CLICK = 500;

const DoubleTapView = ({ children, onDoubleTap, ...rest }: Props) => {
  const pressCountRef = React.useRef<number>(0);

  const currentStartTouchRef = React.useRef<any>(null);
  const currentEndTouchRef = React.useRef<any>(null);
  const previousStartTouchRef = React.useRef<any>(null);
  const previousEndTouchRef = React.useRef<any>(null);
  const timeTouchRef = React.useRef(0);

  const onSingleTap = (event: GestureResponderEvent) => {
  };
  const onPressIn = (event: GestureResponderEvent) => {
    if (previousEndTouchRef.current) {
      const delay = Date.now() - timeTouchRef.current;
      if (delay < DELAY_DOUBLE_CLICK) {
        console.log('on double click')
        onDoubleTap?.(event);
        currentStartTouchRef.current = null;
        currentEndTouchRef.current = null;
        previousEndTouchRef.current = null;
        previousStartTouchRef.current = null;
      } else {
        currentStartTouchRef.current = null;
        currentEndTouchRef.current = null;
        previousEndTouchRef.current = null;
        previousStartTouchRef.current = event.nativeEvent;
      }
    } else {
      currentStartTouchRef.current = null;
      currentEndTouchRef.current = null;
      previousEndTouchRef.current = null;
      previousStartTouchRef.current = event.nativeEvent;
    }
    timeTouchRef.current = Date.now();
  };
  const onPressOut = (event: GestureResponderEvent) => {
    if (previousStartTouchRef.current) {
      const delay = Date.now() - timeTouchRef.current;
      if (delay < DELAY_NORMAL_CLICK) {
        previousEndTouchRef.current = event.nativeEvent;
        timeTouchRef.current = Date.now();
      } else {
        currentStartTouchRef.current = null;
        currentEndTouchRef.current = null;
        previousEndTouchRef.current = null;
        previousStartTouchRef.current = event.nativeEvent;
        timeTouchRef.current = Date.now();
      }
    } else {
      currentStartTouchRef.current = null;
      currentEndTouchRef.current = null;
      previousEndTouchRef.current = null;
      previousStartTouchRef.current = null;
      timeTouchRef.current = Date.now();
    }
  };
  return (
    <TouchableNativeFeedback
      delayPressIn={0}
      delayPressOut={0}
      onPress={onSingleTap}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
        {children}
    </TouchableNativeFeedback>
  );
};

export default DoubleTapView;
