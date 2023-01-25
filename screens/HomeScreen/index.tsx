// navigation
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = (props) => {
    const onPressLearnMore = () => {
        //For generating alert on buttton click
        // alert('Hello');
        props.navigation.navigate('Video', {
            VideoUrl: 'YE7VzlLtp-4'
        });
      };
      return (
        <View style={styles.container}>
          <Button onPress={onPressLearnMore} title="view video" color="#841584" />
        </View>
      );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });