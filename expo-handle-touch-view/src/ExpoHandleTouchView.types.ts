import { ViewProps } from 'react-native';

type OnTouchEvent = {
    type: string;
    x: number;
    y: number;
    rawX: number;
    rawY: number;
};

export interface ExpoHandleTouchViewProps extends ViewProps {
    onTouch?: (event: { nativeEvent: OnTouchEvent }) => void;
};
  