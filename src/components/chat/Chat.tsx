import "./_chat.scss";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getChatById, getChats, getUsers } from "../../redux/chat/chatAPI";
import { ChatObj } from "../../interfaces/chat";
import { ChatState, updateCurrentChat } from "../../redux/chat/chatSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import Message from "./message/Message";
import { useLocation } from "react-router-dom";
import ChatHeader from "./chatHeader/ChatHeader";
import ChatFooter from "./chatFooter/ChatFooter";

const Chat = (props: Partial<ChatState>) => {
  const { user } = props;

  const dispatch = useAppDispatch();

  const currentChat = useAppSelector((state) => state.chatReducer.currentChat);

  const chats = useAppSelector((state) => state.chatReducer.chats);

  const [chat, setChat] = useState<ChatObj>();

  const location = useLocation();

  const scrollRef = useRef<HTMLDivElement>(null);

  const chatId = localStorage.getItem("chatId");

  useEffect(() => {
    if (chatId) {
      dispatch(getChatById(chatId));
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

  return (
    <>
      <ChatHeader currentChat={chat} user={user} />
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
        </div>
      </div>
      <ChatFooter currentChat={chat} user={user} />
    </>
  );
};

export default Chat;
