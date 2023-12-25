import { MdAttachFile } from "react-icons/md";
import "./_chat.scss";
import { PiNavigationArrowThin } from "react-icons/pi";
import { BaseSyntheticEvent, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { uploadDocument } from "../../api/firebase/api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getChats, updateChat } from "../../redux/chat/chatAPI";
import { ChatObj, Message } from "../../interfaces/chat";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";
import {
  setCurrentChat,
  setCurrentChatMessage,
} from "../../redux/chat/chatSlice";
import { v4 as uuid } from "uuid";

const Chat = () => {
  const authContext = useContext(AuthContext);

  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.chatReducer.chats);
  const chat = useAppSelector((state) => state.chatReducer.currentChat);
  const user = useAppSelector((state) => state.chatReducer.user);

  useEffect(() => {
    if (chat) {
      //console.log(chat);
    }
  }, [chat]);

  // useEffect(() => {
  //   const chatId = localStorage.getItem("chatId");
  //   //dispatch(setCurrentChat(chats[chatId as string]));
  // }, [chats]);

  // useEffect(() => {
  //   if (chat) {
  //     console.log(chat, "currentChat");
  //     dispatch(updateChat({ uid: chat.uid, messages: chat.messages }));
  //   }
  // }, [currentMessages]);

  // useEffect(() => {
  //   dispatch(getChats());
  // }, [chatUpdated]);

  let messageText: string;

  const setMessageText = (e: BaseSyntheticEvent | Event) => {
    messageText = e.target.value;
  };

  const sendMessage = () => {
    const uid = uuid();
    if (user) {
      const messageObj: Message = {
        uid,
        displayName: user.displayName,
        text: messageText,
        sentTime: Date.now(),
      };
      dispatch(setCurrentChatMessage(messageObj));
      if (chat) {
        const uid = localStorage.getItem("chatId");
        if (uid) {
          dispatch(updateChat({ uid: uid, messages: chat.messages }));
        }
      }
    }
  };

  const handleDocumentUpload = async (e: BaseSyntheticEvent | Event) => {
    try {
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
      <div className="chat-header">
        <>
          {chat &&
            (chat.firstUser.uid !== user?.uid ? (
              <>
                <LoggedInIcon loggedIn={chat.firstUser.loggedIn} />
                {chat.firstUser.displayName}
              </>
            ) : (
              <>
                <LoggedInIcon loggedIn={chat.secondUser.loggedIn} />
                {chat.secondUser.displayName}
              </>
            ))}
        </>
      </div>
      <div className="chat-message-board-container">
        <div className="chat-message-board">
          {chat &&
            chat.messages.length !== 0 &&
            chat.messages.map((message) => {
              return (
                <div key={message.uid}>
                  <div>{message.text}</div>
                  <div>{new Date(message.sentTime).toLocaleString()}</div>
                </div>
              );
            })}
          <span className="seperator right-seperator"></span>
        </div>
        <div className="chat-footer">
          <span className="chat-input">
            <input
              className="input-box"
              type="text"
              placeholder="Enter Message..."
              onChange={setMessageText}
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
          <span onClick={sendMessage} className="send-button-container">
            <PiNavigationArrowThin size={20} className="send-icon" />
          </span>
        </div>
      </div>
    </span>
  );
};

export default Chat;
