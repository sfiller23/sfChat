import { MdAttachFile } from "react-icons/md";
import "./_chat.scss";
import { PiNavigationArrowThin } from "react-icons/pi";
import { BaseSyntheticEvent, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { uploadDocument } from "../../api/firebase/api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import {
  getChatByUid,
  getChats,
  setWritingState,
  updateChat,
} from "../../redux/chat/chatAPI";
import {
  ChatObj,
  Message as MessageProps,
  MessageStatus,
} from "../../interfaces/chat";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";
import {
  clearChat,
  setCurrentChat,
  setCurrentChatMessage,
} from "../../redux/chat/chatSlice";
import { v4 as uuid } from "uuid";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../App";
import Message from "../message/Message";

const Chat = () => {
  const authContext = useContext(AuthContext);

  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.chatReducer.chats);
  const chat = useAppSelector((state) => state.chatReducer.currentChat);
  const user = useAppSelector((state) => state.chatReducer.user);
  const users = useAppSelector((state) => state.chatReducer.users);

  const uid = localStorage.getItem("chatId");

  useEffect(() => {
    dispatch(getChats());
  }, []);

  useEffect(() => {
    const updateChat = () => {
      const q = query(collection(db, "chats"), where("uid", "==", uid));
      const unSub = onSnapshot(q, (doc) => {
        doc.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              console.log("added");
              //dispatch(getChatByUid(uid as string));
              break;
            case "modified":
              console.log("midofied");
              dispatch(getChatByUid(uid as string));
              break;
            default:
              return;
          }
        });
      });

      return () => {
        unSub();
      };
    };
    updateChat();
  }, []);

  useEffect(() => {
    if (uid) {
      dispatch(getChatByUid(uid));
    }
  }, [uid]);

  let messageText: string;

  const setMessageText = (e: BaseSyntheticEvent | Event) => {
    messageText = e.target.value;
  };

  const sendMessage = () => {
    if (user) {
      const messageObj: MessageProps = {
        uid: uid as string,
        displayName: user.displayName,
        userId: user.uid,
        text: messageText,
        sentTime: Date.now(),
        status: MessageStatus.SENT,
      };
      dispatch(setCurrentChatMessage(messageObj));
      if (chat) {
        if (uid) {
          dispatch(updateChat({ uid: uid, message: messageObj }));
        }
      }
    }
  };

  const setWriting = (isWritineMode: boolean) => {
    if (chat && user) {
      dispatch(
        setWritingState({
          isWriting: isWritineMode,
          uid: chat.uid,
          writerID: user?.uid,
        })
      );
    }
  };

  return (
    <span className="chat-container">
      <div className="chat-header">
        <>
          {chat &&
            (chat.firstUser.uid !== user?.uid ? (
              <>
                <LoggedInIcon
                  loggedIn={
                    users.find((user) => user.uid === chat.firstUser.uid)
                      ?.loggedIn
                  }
                />
                {chat.firstUser.displayName}
              </>
            ) : (
              <>
                <LoggedInIcon
                  loggedIn={
                    users.find((user) => user.uid === chat.secondUser.uid)
                      ?.loggedIn
                  }
                />
                {chat.secondUser.displayName}
              </>
            ))}
        </>
        {chat?.writing?.status && chat.writing.writerID !== user?.uid && (
          <span>
            <img src="../../assets/gifs/writing.gif" alt="Writing..." />
          </span>
        )}
      </div>
      <div className="chat-message-board-container">
        <div className="chat-message-board">
          {chat &&
            chat.messages.length !== 0 &&
            chat.messages.map((message) => {
              return (
                <Message
                  key={message.sentTime}
                  text={message.text}
                  uid={message.uid}
                  sentTime={message.sentTime}
                  userId={message.userId}
                  status={message.status}
                />
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
              onMouseEnter={() => {
                setWriting(true);
              }}
              onMouseLeave={() => {
                setWriting(false);
              }}
            />
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
