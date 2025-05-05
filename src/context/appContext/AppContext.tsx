import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useLocation } from "react-router-dom";
import { getAvatar } from "../../api/firebase/api";
import { AppStateActions } from "../../constants/enums";
import { AuthContext } from "../authContext/AuthContext";

/**
 * AppState Interface
 *
 * Represents the state of the application, including profile image URL,
 * loading state, and profile image change status.
 */
export interface AppState {
  imgProfileUrl: string;
  imgProfileChange: boolean;
  isLoading: boolean;
}

const initialState: AppState = {
  imgProfileUrl: "",
  imgProfileChange: false,
  isLoading: false,
};

export interface ReducerAction {
  type: AppStateActions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any; // Optional payload for the action
}

interface ContextState {
  state: AppState;
  setLoadingState: (isLoading: boolean) => void;
  setImageProfile: (imgUrl: string) => void;
  setImageProfileChange: () => void;
  clearAppState: () => void;
}

export const AppContext = createContext<ContextState | null>(null);

const reducer = (state: AppState, action: ReducerAction): AppState => {
  switch (action.type) {
    case AppStateActions.SET_IMAGE_PROFILE:
      return { ...state, imgProfileUrl: action.payload };
    case AppStateActions.SET_IMAGE_PROFILE_CHANGE:
      return { ...state, imgProfileChange: !state.imgProfileChange };
    case AppStateActions.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AppStateActions.CLEAR:
      return { ...state, ...initialState };
    default:
      throw new Error("Unknown action");
  }
};

export const AppProvider = (children: ReactNode) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const userId = JSON.parse(localStorage.getItem("userId") as string);

  const authContext = useContext(AuthContext);

  const location = useLocation();

  const clearAppState = () => {
    dispatch({ type: AppStateActions.CLEAR });
  };

  const setLoadingState = (isLoading: boolean) => {
    dispatch({
      type: AppStateActions.SET_LOADING,
      payload: isLoading,
    });
  };

  const setImageProfile = (imgUrl: string) => {
    dispatch({
      type: AppStateActions.SET_IMAGE_PROFILE,
      payload: imgUrl,
    });
  };

  const setImageProfileChange = () => {
    dispatch({ type: AppStateActions.SET_IMAGE_PROFILE_CHANGE });
  };

  // Fetch the user's profile image URL when the component mounts or dependencies change
  useEffect(() => {
    let imgUrl: string | undefined = "";
    const getProfileUrl = async () => {
      try {
        if (userId) {
          setLoadingState(true);
          imgUrl = await getAvatar(userId);
          if (imgUrl) {
            setImageProfile(imgUrl);
          }
        }
      } finally {
        setLoadingState(false);
      }
    };
    getProfileUrl();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authContext?.state.user?.loggedIn,
    location.pathname,
    state.imgProfileChange,
    userId,
  ]);

  return (
    <AppContext.Provider
      value={{
        state,
        setLoadingState,
        setImageProfile,
        setImageProfileChange,
        clearAppState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
