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

const Home = () => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);

  useEffect(() => {
    //const uid = localStorage.getItem("uid");
  }, []);

  const logOutHandler = () => {
    authContext?.dispatch({ type: AuthStateActions.LOGOUT });
  };

  const handleDocumentUpload = async (e: BaseSyntheticEvent | Event) => {
    try {
      console.log(e.target.files[0]);
      if (e.target.files[0]) {
        const file = e.target.files[0];
        if (file) {
          await uploadDocument(
            e as Event,
            file,
            authContext?.state.user?.uid as string
          );
        }
      }
    } catch (error) {
      alert(error);
    }
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
          <div className="email-container">
            <h3>{authContext?.state.user?.email}</h3>
          </div>
        </div>
        <UserSearch />
        <UserList />
      </span>
      <span className="seperator"></span>
      <span className="chat-container">
        <div className="chat-header"></div>
        <div className="chat-message-board-container">
          <div className="chat-message-board">
            <span className="seperator right-seperator"></span>
          </div>
          <div className="chat-footer">
            <span className="chat-input">
              <input
                className="input-box"
                type="text"
                placeholder="Enter Message..."
              />
            </span>
            <span className="file-upload-container">
              <input
                className="file-upload"
                name="fileUpload"
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                onChange={handleDocumentUpload}
              />
              <label className="upload-label" htmlFor="fileUpload">
                <MdAttachFile className="upload-icon" size={20} />
              </label>
            </span>
            <span className="send-button-container">
              <PiNavigationArrowThin size={20} className="send-icon" />
            </span>
          </div>
        </div>
      </span>
    </Card>
  );
};

export default Home;
