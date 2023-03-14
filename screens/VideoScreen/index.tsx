// navigation
import { RootStackParamList } from "../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import React from "react";
import DoubleTapView from "../../components/DoubleTapView";
import AppYoutubePlayerView from "./components/AppYoutubePlayerView";
let HandleTouchView: any;

try {
  HandleTouchView = require("expo-handle-touch-view").HandleTouchView;
} catch {
  HandleTouchView = View;
}

type Props = NativeStackScreenProps<RootStackParamList, "Video">;

export const VideoScreen: React.FC<Props> = (props) => {
  const videoWidth =
    Platform.OS === "web" ? 500 : Dimensions.get("window").width;
  // YoutubePlayer recommend 16:9
  const videoHeight = (videoWidth / 16) * 9;

  return (
    <View style={styles.container}>
      <AppYoutubePlayerView 
                videoId={props.route.params.VideoUrl} 
                width={videoWidth} 
                height={videoHeight} 
                pausingBgSource={{uri: 'https://mixkit.imgix.net/videos/preview/mixkit-blue-bubbles-295-0.jpg?q=80&auto=format%2Ccompress&w=460'}}
                pausingIconSource={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsklEQVR4nO1ZO28TQRA+8SooeVQ8fkAqpPMMprKYNRFCUJ54pEX8AYqgCIkuSUUDkYOoqCgQUJCkgB+AEKIAQY0SUmEHQXbPsUPsRXMytsCAd+/2zmfkT1rJ0kne79ubmf1mzvPGGGOMxNBBsLsu4JQinFGEj5WAD0rAFylwmxf/VgLfR88IZ8IyFvUtb5c3bNQnC8ekwHkpYF0J1DZLCvgkCefCEh7NnPjm2ROHJcE9Sdi0Jd4nhLApBVY2S/6hTMjLMlxRBBtJifctwpqkk5dSI659f68UeN85cdEXWou8l1vy5/39UuBK2uRVT8Qy7+ny5DMjr3oh9UIHE/sSC8gibNRf3wRWEpKHqWGRV10RhYuxyH8TcFAJrA5bgCLYiFViuc6bbrLz5pWuX5tKMx8WrMjz7WhzSUVot/T35ys6DM65DyPCZr3sHzc/fYHzNhv8gsaW3n74QIcXTrsWMWdEnk0W+5TYAjpo16q6cXtWqzNFNwIErLNpHCggcpWWf/4vtFY/6q2b152ICMnHgQIiS+xQwE84SfQy3DCJ/ydpCHCT6PBo8BvgxiMtAUkTneCdQQjZW+W4aNsnenVwCMVoUpKiZZjokrDx/wtQox5CatSTWI58GaUcX2QE0wMF8NApt1ZCFMDMzBGu5c7MEa4aT/PYuubPTsOsEfmcNjSNkIpHjAVEb0FgxXSDndcvdf3qZefEVXfBHc8WXyeLB/LR1GMt9tyUZ5XDFiAJg1jkuyIELA5PANz1koL7UCngafYnD0u6VNqTWEBvuAvLGYbNM2fD3d+GvJUswka7Ovk/gWeVqVQnws+JE9Zqbkq4wBeMg3BpcJ3nsu1lDb4d2XbYeqcO8TW2B9Y3bBpgk8VDJ57bsGfnxoM7u+gDHluSqMuDt51n0+wqc/GZdYwxvNHHD8UTXXKBWGX1AAAAAElFTkSuQmCC'}}
                />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 150,
    height: 150,
    alignSelf: "center",
    backgroundColor: "plum",
    margin: 10,
    zIndex: 200,
  },
});
