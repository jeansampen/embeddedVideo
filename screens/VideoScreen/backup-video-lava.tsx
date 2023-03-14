// import React, {ForwardedRef, useContext, useEffect, useImperativeHandle, useState} from 'react'
// import {LayoutRectangle, StyleSheet, View, ViewStyle} from "react-native"
// import {ActivityIndicator} from "react-native-paper"
// import {VideoController, VideoState} from "../controllers/VideoController"
// import {Color, isTablet} from "../../../app/lib/Appearance"
// import CurrentAccountContext from "../../vizz_account/lib/CurrentAccount"
// import AppControllerContext from '../../../app/controllers/AppController'
// import VideoModel from '../models/VideoModel'
// import {Cover} from './video/Cover'
// import FixedAspectView from '../../../app/views/components/FixedAspectView'
// import Vizz from '../../vizz_maker/views/Vizz'
// import {YoutubeVideo} from './video/YoutubeVideo'
// import {AsyncUtils} from '../../../app/utils/AsyncUtils'
// import {ActivityName, TimedActivity} from "../../../app/lib/services/TimedActivity"
// import {ProfileModel} from "../../social/models/ProfileModel"
// import {FRIEND_PICKER_VERTICAL_WIDTH, FriendPickerVertical} from "./FriendPickerVertical"
// import { AppYoutubeVideo } from './video/AppYoutubeVideo'

// type Props = {
//     style?: ViewStyle
//     video: VideoModel
//     friendsForSharing?: ProfileModel[]
//     onTappedFriend?: (friend: ProfileModel) => void
// }

// class VideoStats {
//     static activeVideoComponents: number = 0
// }

// export const Video = React.forwardRef((props: Props, ref: ForwardedRef<any>) => {
//     const currentAccount = useContext(CurrentAccountContext)
//     const appController = useContext(AppControllerContext)
//     const [controller] = useState<VideoController>(() => new VideoController(currentAccount, appController, props.video))
//     const [layout, setLayout] = useState<LayoutRectangle>({x: 0, y: 0, width: 0, height: 0})
//     const [disabled, setDisabled] = useState<boolean>(false)
//     const [playing, setPlaying] = useState<boolean>(false)
//     const [cover, setCover] = useState<boolean>(false)
//     const videoUsageLoggingEnabled = false

//     useEffect(() => {
//         controller.initialize()

//         if (videoUsageLoggingEnabled) {
//             VideoStats.activeVideoComponents++
//             console.log(`Active video components: ${VideoStats.activeVideoComponents}`)
//         }

//         return () => {
//             if (videoUsageLoggingEnabled) {
//                 VideoStats.activeVideoComponents--
//                 console.log(`Active video components: ${VideoStats.activeVideoComponents}`)
//             }

//             controller.uninitialize()
//         }
//     }, [])

//     const renderLoading = () => {
//         return (
//             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//                 <ActivityIndicator color={Color.primary} />
//             </View>
//         )
//     }

//     const block = () => {
//         controller.updateBlocked(true)
//         setDisabled(true)
//     }

//     const unblock = () => {
//         controller.updateBlocked(false)
//         setDisabled(false)
//     }

//     useImperativeHandle(ref, () => ({
//         autoPlay: () => {
//             setPlaying(true)
//             setCover(false)
//         },
//         autoPause: () => {
//             setPlaying(false)
//             setCover(true)
//         }
//     }))

//     const changeYoutubeState = (state: string) => {
//         if (state == 'playing') {
//             TimedActivity.end(ActivityName.PLAY_VIDEO, currentAccount)

//             setPlaying(true)
//             setCover(false)
//         }
//         if (state == 'ended') {
//             setPlaying(false)
//             setCover(true)
//         }
//         if (state == 'pausing') { // explicitly initiated
//             setPlaying(false)
//             setCover(true)
//         }
//         if (state == 'paused') { // fires both for an explicit pause but also when seeking, so don't show cover for this case
//             setPlaying(false)
//         }
//         if (state == 'buffering') {  // sometimes when seeking youtube videos it pauses itself, this helps to unpause it automatically
//             setPlaying(true)
//         }
//     }

//     const changeVizzState = (state: string) => {
//         if (state == 'playing') {
//             setPlaying(true)
//             setCover(false)
//         }
//         if (state == 'stopped') {
//             setPlaying(false)
//             setCover(true)
//         }
//     }

//     const play = async() => {
//         setCover(false)
//         setPlaying(true) // at the end of a youtube video, this single call to play does not always work
//         await AsyncUtils.sleep(500)
//         setPlaying(true)
//         await AsyncUtils.sleep(500)
//         setPlaying(true)
//     }

//     return (
//         <View style={[styles.container, props.style, disabled ? { opacity: 0.1 } : {}]} onLayout={(e) => setLayout(e.nativeEvent.layout)}>
//             {controller.state == VideoState.LOADING && renderLoading()}
//             {controller.state == VideoState.LOADED &&
//             <View style={{backgroundColor: 'black', width: '100%', height: Math.round(layout.width * (9/16))}}>

//                 {cover && <Cover imageUrl={props.video.thumbnail_url} onPlay={play} onBlock={() => block()} onUnblock={() => unblock()} />}

//                 {props.video.youtube_key &&
//                 <YoutubeVideo
//                     width={Math.round(layout.width)}
//                     height={Math.round(layout.width * (9/16))}
//                     youtubeId={props.video.youtube_key}
//                     play={playing}
//                     onChangeState={changeYoutubeState}
//                 />}

//                 {!props.video.youtube_key && props.video.vizz &&
//                 <FixedAspectView aspectRatio={9 / 16}>
//                     <Vizz
//                         vizz={props.video.vizz}
//                         preload={true}
//                         play={playing}
//                         onChangeState={changeVizzState}
//                     />
//                 </FixedAspectView>
//                 }
//             </View>
//             }
//             {props.friendsForSharing &&
//             props.friendsForSharing.length > 0 &&
//             controller.state == VideoState.LOADED &&
//             <View
//                 style={{
//                     flex: 1,
//                     justifyContent: 'center',
//                     position: 'absolute',
//                     right: isTablet() ? -(FRIEND_PICKER_VERTICAL_WIDTH / 2) : 4,
//                     top: 0,
//                     bottom: 0
//                 }}>
//                     <FriendPickerVertical
//                         friends={props.friendsForSharing}
//                         onTappedFriend={props.onTappedFriend}
//                     />
//                 </View>
//             }
//         </View>
//     )
// })

// const styles = StyleSheet.create({
//     container: {
//     },
// })
