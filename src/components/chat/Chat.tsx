import "./_chat.scss";
import { PiNavigationArrowThin } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import {
  getChatByUid,
  getChats,
  getUsers,
  setMessageSeenReq,
  setNewMessageState,
  setUserNewMessage,
  setWritingState,
  updateChat,
} from "../../redux/chat/chatAPI";
import { ChatObj, Message as MessageProps } from "../../interfaces/chat";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";
import {
  ChatState,
  setCurrentChat,
  setCurrentChatMessage,
  updateCurrentChat,
} from "../../redux/chat/chatSlice";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../App";
import Message from "../message/Message";
import { MessageStatus } from "../../constants/enums";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Chat = (props: Partial<ChatState>) => {
  const { user } = props;
  const dispatch = useAppDispatch();

  const currentChat = useAppSelector((state) => state.chatReducer.currentChat);
  const users = useAppSelector((state) => state.chatReducer.users);
  const chats = useAppSelector((state) => state.chatReducer.chats);

  const [chat, setChat] = useState<ChatObj>();

  const [messageText, setMessageText] = useState("");

  const location = useLocation();

  const scrollRef = useRef<HTMLDivElement>(null);

  const chatId = localStorage.getItem("chatId");

  useEffect(() => {
    if (chatId) {
      dispatch(getChatByUid(chatId));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (currentChat) {
      setChat(chats[currentChat.chatId]);
    }
  }, [chats, currentChat]);

  useEffect(() => {
    const updateChat = () => {
      const unSub = onSnapshot(collection(db, "chats"), (doc) => {
        doc.docChanges().forEach((change) => {
          dispatch(getChats());
          dispatch(getUsers());
          dispatch(updateCurrentChat(change.doc.data()));
        });
      });

      return () => {
        unSub();
      };
    };
    updateChat();
  }, []);

  // useEffect(() => {
  //   if (chatId) {
  //     dispatch(getChatByUid(chatId));
  //   }
  // }, [chatId]);

  const sendMessage = () => {
    setWriting(false);
    if (user) {
      const messageObj: MessageProps = {
        displayName: user.displayName,
        userId: user.userId,
        text: messageText,
        sentTime: Date.now(),
        status: MessageStatus.SENT,
      };
      dispatch(setCurrentChatMessage(messageObj));
      if (chat) {
        if (chat.chatId) {
          dispatch(updateChat({ chatId: chat.chatId, message: messageObj }));
          // dispatch(
          //   setNewMessageState({
          //     userId:
          //       user.userId === chat.firstUser.userId
          //         ? chat.firstUser.userId
          //         : chat.secondUser.userId,
          //     state: true,
          //   })
          // );
        }
      }

      setMessageText("");
    }
  };

  const setWriting = (isWritingMode: boolean) => {
    if (chat && user) {
      dispatch(
        setWritingState({
          isWriting: isWritingMode,
          chatId: chat.chatId,
          writerID: user?.userId,
        })
      );
    }
  };

  const setMessageSeen = () => {
    if (chat) {
      if (chat.messages.length !== 0) {
        if (chat?.messages[chat?.messages.length - 1].userId !== user?.userId) {
          dispatch(setMessageSeenReq(chat.chatId));
          // dispatch(
          //   setNewMessageState({
          //     userId: chat?.messages[chat?.messages.length - 1].userId,
          //     state: false,
          //   })
          // );
        }
      }
    }
  };

  return (
    <span className="chat-container">
      <div className="chat-header">
        <>
          {chat?.writing?.status && chat.writing.writerID !== user?.userId && (
            <span className="writing-gif-container">
              <img src="../../assets/gifs/writing.gif" alt="Writing..." />
            </span>
          )}
          {chat &&
            (chat.firstUser.userId !== user?.userId ? (
              <>
                <span className="logged-in-icon-container">
                  {" "}
                  <LoggedInIcon
                    loggedIn={
                      users.find(
                        (user) => user.userId === chat.firstUser.userId
                      )?.loggedIn
                    }
                  />
                </span>
                <span>
                  <h3>{chat.firstUser.displayName}</h3>
                </span>
              </>
            ) : (
              <>
                <span className="logged-in-icon-container">
                  <LoggedInIcon
                    loggedIn={
                      users.find(
                        (user) => user.userId === chat.secondUser.userId
                      )?.loggedIn
                    }
                  />
                </span>
                <span>
                  <h3>{chat.secondUser.displayName}</h3>
                </span>
              </>
            ))}
        </>
      </div>
      <div ref={scrollRef} className="chat-message-board-container">
        <div className="chat-message-board">
          {chat &&
            chat.messages.length !== 0 &&
            chat.messages.map((message, index) => {
              return (
                <Message
                  key={message.sentTime}
                  text={message.text}
                  sentTime={message.sentTime}
                  userId={message.userId}
                  status={message.status}
                  index={index}
                  chatId={chat.chatId}
                />
              );
            })}
          <span className="seperator right-seperator"></span>
        </div>
      </div>
      <div className="chat-footer">
        <span className="chat-input">
          <input
            className="input-box"
            type="text"
            placeholder="Enter Message..."
            value={messageText}
            onInput={() => {
              setWriting(true);
            }}
            onMouseLeave={() => {
              setWriting(false);
            }}
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
            onFocus={() => {
              setMessageSeen();
            }}
          />
        </span>
        <span onClick={sendMessage} className="send-button-container">
          <PiNavigationArrowThin size={20} className="send-icon" />
        </span>
      </div>
    </span>
  );
};

export default Chat;
