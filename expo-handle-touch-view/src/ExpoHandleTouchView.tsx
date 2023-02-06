import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ExpoHandleTouchViewProps } from './ExpoHandleTouchView.types';

const NativeView: React.ComponentType<ExpoHandleTouchViewProps> = requireNativeViewManager('ExpoHandleTouchView');

export default function ExpoHandleTouchView(props: ExpoHandleTouchViewProps) {
  return <NativeView {...props} />;
}