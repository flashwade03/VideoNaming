import React, {
  useState,
  useReducer,
  createContext,
  useContext,
  useRef,
} from 'react';
/*
videos = {
  id:
  filepath:
  filename:
  newname:
}
*/
const initialVideoData = {
  videos: [],
};

/*
user config = {
  username
}
*/
const initialUserData = {
  username: null,
  edit: false,
  games: [],
  resolutions: [],
  tags: [],
};

/*
ADD
REMOVE
MODIFY
*/
function videoDataReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        videos: state.videos.concat(action.data),
      };
    case 'REMOVE':
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.id),
      };
    case 'TOGGLE':
      return {
        ...state,
        videos: state.videos.map((video) =>
          video.id === action.id ? { ...video, check: !video.check } : video,
        ),
      };
    case 'MODIFY':
      return {
        ...state,
        videos: state.videos.map((video) =>
          video.id === action.id
            ? { ...video, newfilename: action.newfilename }
            : video,
        ),
      };
    case 'FINISHED_CHANGE_FILE_NAME':
      return {
        ...state,
        videos: state.videos.map((video) =>
          video.id === action.id
            ? { ...video, filename: video.newfilename, newfilename: null }
            : video,
        ),
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function userConfigReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        username: action.username,
      };
    case 'TOGGLE':
      return {
        ...state,
        edit: !state.edit,
      };
    case 'SET_CONFIG':
      return {
        ...state,
        games: action.games.sort(),
        resolutions: action.resolutions.sort(),
        tags: action.tags.sort(),
      };
    case 'ADD_GAME':
      return {
        ...state,
        games: [...new Set(state.games.concat(action.game))].sort(),
      };
    case 'ADD_RESOLUTION':
      return {
        ...state,
        resolutions: [
          ...new Set(state.resolutions.concat(action.resolution)),
        ].sort(),
      };
    case 'ADD_TAG':
      return {
        ...state,
        tags: [...new Set(state.tags.concat(action.tag))].sort(),
      };
    case 'REMOVE_GAME':
      return {
        ...state,
        games: state.games.filter((game) => game !== action.game),
      };
    case 'REMOVE_RESOLUTION':
      return {
        ...state,
        resolutions: state.resolutions.filter(
          (resolution) => resolution !== action.resolution,
        ),
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.tag),
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const VideoDataContext = createContext();
const VideoDataDispatch = createContext();
const VideoNextIdContext = createContext();
const UserConfigContext = createContext();
const UserConfigDispatch = createContext();

export default function VideoDataProvider({ children }) {
  const [state, dispatch] = useReducer(videoDataReducer, initialVideoData);
  const [user, updateDispatch] = useReducer(userConfigReducer, initialUserData);
  const nextId = useRef(state.videos.length + 1);

  return (
    <VideoDataContext.Provider value={state}>
      <VideoDataDispatch.Provider value={dispatch}>
        <VideoNextIdContext.Provider value={nextId}>
          <UserConfigContext.Provider value={user}>
            <UserConfigDispatch.Provider value={updateDispatch}>
              {children}
            </UserConfigDispatch.Provider>
          </UserConfigContext.Provider>
        </VideoNextIdContext.Provider>
      </VideoDataDispatch.Provider>
    </VideoDataContext.Provider>
  );
}

export function useUserConfig() {
  const context = useContext(UserConfigContext);
  if (!context) {
    throw new Error("Can't find user config context");
  }
  return context;
}

export function useUserConfigDispatch() {
  const context = useContext(UserConfigDispatch);
  if (!context) {
    throw new Error("Can't find user config dispath");
  }
  return context;
}

export function useVideoData() {
  const context = useContext(VideoDataContext);
  if (!context) {
    throw new Error("Can't find video data context");
  }
  return context;
}

export function useVideoDataDispatch() {
  const context = useContext(VideoDataDispatch);
  if (!context) {
    throw new Error("Can't find video data dispatch");
  }
  return context;
}

export function useNextId() {
  const context = useContext(VideoNextIdContext);
  if (!context) {
    throw new Error("Can't find video id context");
  }
  return context;
}
