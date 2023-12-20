import { MdAttachFile } from "react-icons/md";
import Card from "../../UI/card/Card";
import "./home.css";
import { BaseSyntheticEvent, useContext, useEffect } from "react";
import {
  AuthContext,
  AuthStateActions,
} from "../../context/authContext/AuthContext";
import { PiNavigationArrowThin } from "react-icons/pi";
import { uploadDocument } from "../../api/firebase/api";
import { AppContext } from "../../context/appContext/AppContext";
import Loader from "../../UI/loader/Loader";
import ImgPreviewButton, {
  PreviewState,
} from "../../components/imgPreviewButton/ImgPreviewButton";
import UserList from "../../components/userList/UserList";
import UserSearch from "../../components/userSearch/UserSearch";
import Chat from "../../components/chat/Chat";

const Home = () => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  // useEffect(() => {
  //   if(authContext?.state.user?.displayName){

  //   }
  // }, [authContext?.state.user?.displayName]);

  const logOutHandler = () => {
    authContext?.dispatch({ type: AuthStateActions.LOGOUT });
  };

  return (
    <Card classNames={["chat-card"]}>
      <span className="users-container">
        <div
          className={`user-header ${
            !!appContext?.state.imgProfileUrl && "no-image"
          }`}
        >
          {appContext?.state.isLoading ? (
            <Loader className="profile-image-loader" />
          ) : (
            <span className="user-img-container">
              {!!appContext?.state.imgProfileUrl && (
                <img
                  className="user-img"
                  src={appContext?.state.imgProfileUrl}
                  alt="Profile Image"
                />
              )}
              <ImgPreviewButton
                action={
                  !!appContext?.state.imgProfileUrl
                    ? PreviewState.EDIT
                    : PreviewState.ADD
                }
                inForm={false}
              />
            </span>
          )}

          <span className="logout-button-container">
            <button
              type="button"
              onClick={logOutHandler}
              className="logout-button"
            >
              Logout
            </button>
          </span>
          <div className="display-name-container">
            <h3>{authContext?.state.user?.displayName}</h3>
          </div>
        </div>
        <UserSearch />
        <UserList />
      </span>
      <span className="seperator"></span>
      <Chat />
    </Card>
  );
};

export default Home;
