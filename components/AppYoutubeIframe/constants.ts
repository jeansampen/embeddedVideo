export const PLAY_MODE = true;
export const PAUSE_MODE = false;
export const MUTE_MODE = true;
export const UNMUTE_MODE = false;

export const PLAYER_STATES_NAMES = {
  UNSTARTED: 'unstarted',
  ENDED: 'ended',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  VIDEO_CUED: 'video cued',
};

export const PLAYER_STATE_UNSTARTED_INDEX = -1;
export const PLAYER_STATE_ENDED_INDEX = 0;
export const PLAYER_STATE_PLAYING_INDEX = 1;
export const PLAYER_STATE_PAUSED_INDEX = 2;
export const PLAYER_STATE_BUFFERING_INDEX = 3;
export const PLAYER_STATE_VIDEO_CUED_INDEX = 5;

export const onGetStateName = (index: number) => {
  switch(index){
    case -1:
      return PLAYER_STATES_NAMES.UNSTARTED;
    case 0:
      return PLAYER_STATES_NAMES.ENDED;
    case 1:
      return PLAYER_STATES_NAMES.PLAYING;
    case 2:
      return PLAYER_STATES_NAMES.PAUSED;
    case 3:
      return PLAYER_STATES_NAMES.BUFFERING;
    default:
      return PLAYER_STATES_NAMES.VIDEO_CUED;
  }
}

export const PLAYER_ERROR_NAMES = {
  INVALID_PARAMETER: 'invalid_parameter',
  HTML5_ERROR: 'HTML5_error',
  VIDEO_NOT_FOUND: 'video_not_found',
  EMBED_NOT_ALLOWED: 'embed_not_allowed',
};

export const onGetError = (index: number) => {
  switch(index){
    case 2:
      return PLAYER_ERROR_NAMES.INVALID_PARAMETER;
    case 5:
      return PLAYER_ERROR_NAMES.HTML5_ERROR;
    case 100:
      return PLAYER_ERROR_NAMES.VIDEO_NOT_FOUND;
    case 101:
      return PLAYER_STATES_NAMES.PAUSED;
    default:
      return PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED;
  }
} 

export const CUSTOM_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';
