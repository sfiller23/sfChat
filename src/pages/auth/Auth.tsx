import { Link, useLocation } from "react-router-dom";
import Card from "../../UI/card/Card";
import "./_auth.scss";
import { BaseSyntheticEvent, useContext } from "react";
import { login, register, uploadAvatar } from "../../api/firebase/api";
import Loader from "../../UI/loader/Loader";
import { AuthContext } from "../../context/authContext/AuthContext";
import { AppContext } from "../../context/appContext/AppContext";
import ImgPreviewButton from "../../components/common/imgPreviewButton/ImgPreviewButton";
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
      appContext?.setLoadingState(true);

      if (location === "/login") {
        credentials = await login(email, password);
      } else if (location === "/register") {
        displayName = e.target[3].value;

        credentials = await register(email, password, displayName);

        const file = e.target[4].files[0];
        const userId = credentials.user.uid;

        if (file) {
          await uploadAvatar(e as Event, file, userId);
        }
      }
      authContext?.logIn({ ...credentials.user, displayName });
    } catch (error) {
      alert(error);
    } finally {
      appContext?.setLoadingState(false);
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
