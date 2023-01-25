import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YoutubePlayer from "react-native-youtube-iframe";
import { useCallback, useState } from 'react';
import React from 'react';
import Navigation from './navigation';


export default function App() {
  
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}