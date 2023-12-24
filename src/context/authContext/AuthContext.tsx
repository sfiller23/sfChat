import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useReducer, ReactElement, useEffect } from "react";
import { auth, db } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "../../interfaces/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getUserByUid } from "../../redux/chat/chatAPI";
import { setAuthenticatedUser } from "../../redux/chat/chatSlice";

export interface AuthState {
  user: User | null;
  loggedIn: boolean;
  accessToken?: string;
  error: string;
}

export enum AuthStateActions {
  LOGIN,
  LOGOUT,
  REFRESH,
  SET_DISPLAY_NAME,
}

const initialState: AuthState = {
  user: null,
  loggedIn: false,
  accessToken: "",
  error: "",
};

export interface ReducerAction {
  type: AuthStateActions;
  payload?: any;
}

interface ContextState {
  state: AuthState;
  dispatch: React.Dispatch<ReducerAction>;
}

export const AuthContext = createContext<ContextState | null>(null);

const reducer = (state: AuthState, action: ReducerAction): AuthState => {
  switch (action.type) {
    case AuthStateActions.LOGIN:
      localStorage.setItem(
        "accessToken",
        JSON.stringify(action.payload?.accessToken)
      );
      localStorage.setItem("uid", JSON.stringify(action.payload?.uid));
      return {
        ...state,
        user: {
          uid: action.payload.uid,
          displayName: action.payload.displayName,
          email: action.payload.email,
          loggedIn: true,
        },
        loggedIn: true,
        accessToken: action.payload?.accessToken,
      };

    case AuthStateActions.LOGOUT:
      signOut(auth);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("uid");
      localStorage.removeItem("chatId");
      return { ...state, loggedIn: false, user: null, accessToken: "" };

    case AuthStateActions.REFRESH:
      return { ...state, user: action.payload as User, loggedIn: true };

    case AuthStateActions.SET_DISPLAY_NAME:
      return {
        ...state,
        user: { ...state.user, displayName: action.payload } as User,
      };

    default:
      throw new Error("Unknown action");
  }
};

type ChildrenType = {
  children?: ReactElement | ReactElement[] | undefined;
};

export const AuthProvider = ({ children }: ChildrenType): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  const chatSliceDispatch = useAppDispatch();

  //const currentDisplayName = useAppSelector((state)=>state.chatReducer.);

  const uid = JSON.parse(localStorage.getItem("uid") as string);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({
        type: AuthStateActions.REFRESH,
        payload: user
          ? {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              loggedin: true,
            }
          : user,
      });
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (uid) {
      chatSliceDispatch(getUserByUid(uid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    token ? navigate("/home") : navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
