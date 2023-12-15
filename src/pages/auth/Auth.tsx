import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../../UI/card/Card";
import "./auth.css";
import { BaseSyntheticEvent, useContext, useState } from "react";
import { auth } from "../../App";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { RiImageAddFill } from "react-icons/ri";
import { uploadAvatar } from "../../api/firebase/api";
import Loader from "../../UI/loader/Loader";
import {
  AuthContext,
  AuthStateActions,
} from "../../context/authContext/AuthContext";

const Auth = () => {
  const authContext = useContext(AuthContext);

  const location = useLocation();

  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: BaseSyntheticEvent | Event,
    location: string
  ) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      let credentials: any = {};
      setIsLoading(true);

      if (location === "/login") {
        credentials = await signInWithEmailAndPassword(auth, email, password);
      } else if (location === "/register") {
        setIsLoading(true);
        const file = e.target[4].files[0];
        if (file) {
          await uploadAvatar(e as Event, file);
        }
        credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      setIsLoading(false);
      authContext?.dispatch({
        type: AuthStateActions.LOGIN,
        payload: credentials.user,
      });
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };

  const handleImgPick = (e: BaseSyntheticEvent | Event) => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const authUrl = location.pathname;

  return isLoading ? (
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
            <input
              type="file"
              name="avatar"
              id="avatar"
              style={{ display: `${!picture ? "none" : "block"}` }}
              onChange={(e) => {
                e.preventDefault();
                handleImgPick(e);
              }}
            />
            {!picture && (
              <label className="avatar-label" htmlFor="avatar">
                <RiImageAddFill size={20} />
                <span>Add an Avatar</span>
              </label>
            )}
            {imgData && (
              <img
                className="img-preview"
                src={imgData as string}
                alt="Image Preview"
              />
            )}
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
