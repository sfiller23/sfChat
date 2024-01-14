import { signOut } from "firebase/auth";
import {
  createContext,
  useReducer,
  ReactElement,
  useEffect,
  useLayoutEffect,
} from "react";
import { auth } from "../../App";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/auth";
import { useAppDispatch } from "../../redux/hooks/reduxHooks";
import { getUserById } from "../../redux/chat/chatAPI";
import { AuthStateActions } from "../../constants/enums";

export interface AuthState {
  user: User | null;
  loggedIn: boolean;
  accessToken?: string;
  error: string;
}

const initialState: AuthState = {
  user: null,
  loggedIn: false,
  accessToken: "",
  error: "",
};

export interface ReducerAction {
  type: AuthStateActions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      localStorage.setItem("userId", JSON.stringify(action.payload?.uid));
      return {
        ...state,
        user: {
          userId: action.payload.uid,
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
      localStorage.removeItem("userId");
      localStorage.removeItem("chatId");
      localStorage.removeItem("activeUid");
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

  const userId = JSON.parse(localStorage.getItem("userId") as string);

  const token = JSON.parse(localStorage.getItem("accessToken") as string);

  useLayoutEffect(() => {
    if (userId) {
      chatSliceDispatch(getUserById(userId));
    }
  }, [userId]);

  useEffect(() => {
    token ? navigate("/home") : navigate("/login");
  }, [token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
