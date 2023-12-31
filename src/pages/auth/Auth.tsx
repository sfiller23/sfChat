import { Link, useLocation } from "react-router-dom";
import Card from "../../UI/card/Card";
import "./auth.css";
import { BaseSyntheticEvent, useContext } from "react";
import { auth, db } from "../../App";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { uploadAvatar } from "../../api/firebase/api";
import Loader from "../../UI/loader/Loader";
import { AuthContext } from "../../context/authContext/AuthContext";
import { AppContext } from "../../context/appContext/AppContext";
import ImgPreviewButton from "../../components/imgPreviewButton/ImgPreviewButton";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { AppStateActions, AuthStateActions } from "../../constants/enums";

const Auth = () => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  const location = useLocation();

  const handleSubmit = async (
    e: BaseSyntheticEvent | Event,
    location: string
  ) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const repeatPassword = e.target[2].value;

    if (repeatPassword) {
      if (password !== repeatPassword) {
        alert("Passwords don't match");
        return;
      }
    }

    try {
      let displayName: string = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let credentials: any = {};
      appContext?.dispatch({
        type: AppStateActions.SET_LOADING,
        payload: true,
      });

      if (location === "/login") {
        credentials = await signInWithEmailAndPassword(auth, email, password);
        await updateDoc(doc(db, "users", credentials.user.uid), {
          loggedIn: true,
        });
      } else if (location === "/register") {
        credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        displayName = e.target[3].value;
        const file = e.target[4].files[0];
        const uid = credentials.user.uid;
        if (file) {
          await uploadAvatar(e as Event, file, uid);
        }
        await setDoc(doc(db, "users", uid), {
          userId: uid,
          displayName,
          email,
          loggedIn: true,
        });
        localStorage.removeItem("chatId");
      }
      authContext?.dispatch({
        type: AuthStateActions.LOGIN,
        payload: {
          ...credentials.user,
          displayName: displayName,
          loggedIn: true,
        },
      });
    } catch (error) {
      alert(error);
    } finally {
      appContext?.dispatch({
        type: AppStateActions.SET_LOADING,
        payload: false,
      });
    }
  };

  const authUrl = location.pathname;

  return appContext?.state.isLoading ? (
    <Loader />
  ) : (
    <Card classNames={["auth-card"]}>
      <h2 className="auth-title">SF-Chat</h2>
      <h3 className="auth-subtitle">
        {`${authUrl === "/register" ? "Register" : "Login"}`}
      </h3>
      <form
        className="auth-form"
        onSubmit={(e) => {
          handleSubmit(e, authUrl);
        }}
      >
        <input type="email" name="email" placeholder="e-Mail" required />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <br />
        {authUrl === "/register" && (
          <>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat Password"
              required
            />
            <br />
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <br />
            <ImgPreviewButton />
          </>
        )}
        <button type="submit" className="auth-button">
          {authUrl === "/register" ? "Register" : "Login"}
        </button>
        <p>
          {`${authUrl === "/register" ? "Already registerd?" : "No Account?"}`}{" "}
          <Link
            className="register-link"
            to={`${authUrl !== "/register" ? "/register" : "/login"}`}
          >
            {authUrl !== "/register" ? "Register now" : "Back to Login"}
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Auth;
