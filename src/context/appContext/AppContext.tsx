import { User } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import {
  createContext,
  useReducer,
  ReactElement,
  useEffect,
  useContext,
} from "react";
import { storage } from "../../App";
import { AuthContext } from "../authContext/AuthContext";
import { AppStateActions } from "../../constants/enums";

export interface AppState {
  imgProfileUrl: string;
  imgProfileChange: boolean;
  users: User[];
  isLoading: boolean;
  error: string;
}

const initialState: AppState = {
  imgProfileUrl: "",
  imgProfileChange: false,
  users: [],
  isLoading: false,
  error: "",
};

export interface ReducerAction {
  type: AppStateActions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface ContextState {
  state: AppState;
  dispatch: React.Dispatch<ReducerAction>;
}

export const AppContext = createContext<ContextState | null>(null);

const reducer = (state: AppState, action: ReducerAction): AppState => {
  switch (action.type) {
    case AppStateActions.SET_IMAGE_PROFILE:
      return { ...state, imgProfileUrl: action.payload };
    case AppStateActions.SET_IMAGE_PROFILE_CHANGE:
      return { ...state, imgProfileChange: !state.imgProfileChange };
    case AppStateActions.SET_ERROR:
      return { ...state };
      break;
    case AppStateActions.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      throw new Error("Unknown action");
  }
};

type ChildrenType = {
  children?: ReactElement | ReactElement[] | undefined;
};

export const AppProvider = ({ children }: ChildrenType): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const uid = JSON.parse(localStorage.getItem("uid") as string);

  const authContext = useContext(AuthContext);

  const storageRef = ref(storage);

  useEffect(() => {
    let imgUrl: string = "";
    const getProfileUrl = async () => {
      try {
        dispatch({
          type: AppStateActions.SET_LOADING,
          payload: true,
        });
        if (uid) {
          imgUrl = await getDownloadURL(ref(storageRef, uid));

          dispatch({
            type: AppStateActions.SET_IMAGE_PROFILE,
            payload: imgUrl,
          });
        } else {
          dispatch({
            type: AppStateActions.SET_IMAGE_PROFILE,
            payload: "",
          });
        }
      } catch (error) {
        if (imgUrl) {
          alert(error);
        }
      } finally {
        dispatch({
          type: AppStateActions.SET_LOADING,
          payload: false,
        });
      }
    };
    getProfileUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext?.state.loggedIn, state.imgProfileChange, uid]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
