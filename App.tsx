import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YoutubePlayer from "react-native-youtube-iframe";
import { useCallback, useState } from 'react';


const HomeScreen = ({navigation}) => {
  const onPressLearnMore = () => {
    //For generating alert on buttton click
    // alert('Hello');
    navigation.navigate('Video', {videoUrl: 'YE7VzlLtp-4'})
  };


  return (
    <View style={styles.container}>
      <Button onPress={onPressLearnMore} title="view video" color="#841584" />
      <StatusBar style="auto" />
    </View>
  );
}

function ViewVideoScreen() {
  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      // Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={300}
        width={500}
        play={playing}
        videoId={"YE7VzlLtp-4"}
        onChangeState={onStateChange}
      />
      {Platform.OS === 'web' ? <View/> : <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />}
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {

  const linking : LinkingOptions<{}> = {
    prefixes: [
      /* your linking prefixes */
    ],
    config: {
      screens: {
        Home: '/home',
        Video: '/video',
      },
    }
  };
  
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Video" component={ViewVideoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
