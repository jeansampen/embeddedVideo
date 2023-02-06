import type { ImageSourcePropType } from 'react-native';
import type { ViewProps } from 'react-native';
import { YoutubeIframeProps } from 'react-native-youtube-iframe';

export interface IAppYoutubeIframePropsProps extends YoutubeIframeProps  {
    pausingBgSource?: ImageSourcePropType,
    pausingIconSource?: ImageSourcePropType,
}