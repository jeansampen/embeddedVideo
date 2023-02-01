import type { ImageProps, ImageSourcePropType } from 'react-native';
import type { ViewProps, ButtonProps } from 'react-native';

export interface IOverlayProps extends ViewProps  {
    imageSource?: ImageSourcePropType,
    btnSource?: ImageSourcePropType,
    onPress?: (() => void),
}