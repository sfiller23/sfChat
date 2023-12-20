import { MdAttachFile } from "react-icons/md";
import "./_chat.scss";
import { PiNavigationArrowThin } from "react-icons/pi";
import { BaseSyntheticEvent, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { uploadDocument } from "../../api/firebase/api";
import { useAppDispatch } from "../../redux/hooks/reduxHooks";
import { getChats } from "../../redux/chat/chatAPI";

const Chat = () => {
  const authContext = useContext(AuthContext);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChats());
  }, []);

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
  );
};

export default Chat;
