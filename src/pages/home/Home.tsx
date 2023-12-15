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

const Home = () => {
  const authContext = useContext(AuthContext);

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
        <div className="user-header">
          <span className="user-img-container">
            <img
              className="user-img"
              src={authContext?.state.user?.photoURL as string}
              alt={authContext?.state.user?.email as string}
            />
          </span>
          <span className="logout-button-container">
            <button
              type="button"
              onClick={logOutHandler}
              className="logout-button"
            >
              Logout
            </button>
          </span>
        </div>
        <div className="search-input-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search Users..."
          />
        </div>
        <div className="users-list-container">
          <ul className="users-list">
            <li className="list-item">Admin</li>
          </ul>
        </div>
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
