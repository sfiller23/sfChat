import { User } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { createContext, useReducer, ReactElement, useEffect } from "react";
import { storage } from "../../App";

export interface AppState {
  imgProfileUrl: string;
  users: User[];
  loading: boolean;
  error: string;
}

export enum AppStateActions {
  SET_IMAGE,
  SET_USERS,
  SET_ERROR,
  SET_LOADING,
}

const initialState: AppState = {
  imgProfileUrl: "",
  users: [],
  loading: false,
  error: "",
};

export interface ReducerAction {
  type: AppStateActions;
  payload?: any;
}

interface ContextState {
  state: AppState;
  dispatch: React.Dispatch<ReducerAction>;
}

export const AppContext = createContext<ContextState | null>(null);

const reducer = (state: AppState, action: ReducerAction): AppState => {
  switch (action.type) {
    case AppStateActions.SET_ERROR:
      break;
    case AppStateActions.SET_LOADING:
      break;
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

  const storageRef = ref(storage);

  const pathReference = ref(storageRef, "/");

  const gsReference = ref(storage, "gs://bucket/images/stars.jpg");

  const httpsReference = ref(
    storage,
    "https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg"
  );

  useEffect(() => {
    const getProfileUrl = async () => {
      try {
        if (uid) {
          const res = await getDownloadURL(ref(storageRef, uid));
          console.log(res, "from app context");
        }
      } catch (error) {
        alert(error);
      }
    };
    getProfileUrl();
  }, [uid]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
