import { ViewProps } from 'react-native';

type OnTouchEvent = {
    type: string;
};

export interface ExpoHandleTouchViewProps extends ViewProps {
    onTouch?: (event: { nativeEvent: OnTouchEvent }) => void;
};
  