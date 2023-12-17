import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useReducer, ReactElement, useEffect } from "react";
import { auth } from "../../App";
import { useNavigate } from "react-router-dom";

export interface AuthState {
  user: User | null;
  logedIn: boolean;
  accessToken?: string;
  error: string;
}

export enum AuthStateActions {
  LOGIN,
  LOGOUT,
  REFRESH,
}

const initialState: AuthState = {
  user: null,
  logedIn: false,
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
        user: action.payload as User,
        logedIn: true,
        accessToken: action.payload?.accessToken,
      };

    case AuthStateActions.LOGOUT:
      signOut(auth);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("uid");
      return { ...state, logedIn: false, user: null, accessToken: "" };

    case AuthStateActions.REFRESH:
      return { ...state, user: action.payload as User };

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

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    token ? navigate("/home") : navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: AuthStateActions.REFRESH, payload: user });
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
