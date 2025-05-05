import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../../firebase";
import { User } from "../../interfaces/auth";
import { ChatObj } from "../../interfaces/chat";
import { getChatById, getChats, getUsers } from "../../redux/chat/chatAPI";
import { ChatState, updateCurrentChat } from "../../redux/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import "./_chat.scss";
import ChatFooter from "./chatFooter/ChatFooter";
import ChatHeader from "./chatHeader/ChatHeader";
import Message from "./message/Message";

/**
 * Chat Component
 *
 * This component represents the main chat interface. It displays the chat header,
 * the list of messages, and the chat footer for sending new messages. It also handles
 * real-time updates to the chat using Firestore listeners.
 *
 * Props:
 * - `user`: The current user object.
 */
const Chat = (props: Partial<ChatState>) => {
  const { user } = props;

  const dispatch = useAppDispatch();

  const currentChat = useAppSelector((state) => state.chatReducer.currentChat);

  const chats = useAppSelector((state) => state.chatReducer.chats);

  const [chat, setChat] = useState<ChatObj>();

  const location = useLocation();

  const chatId = localStorage.getItem("chatId");
  // Fetch the chat by ID when the component mounts or the location changes
  useEffect(() => {
    if (chatId) {
      dispatch(getChatById(chatId));
    }
  }, [location.pathname]);
  // Update the local chat state when the current chat or chats change
  useEffect(() => {
    if (currentChat) {
      setChat(chats[currentChat.chatId]);
    }
  }, [chats, currentChat]);

  // Set up a Firestore listener to update the chat in real-time
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
      {/* Chat header displaying the participant's name and status */}
      <ChatHeader currentChat={chat} user={user} />
      <div className="chat-message-board-container">
        <div className="chat-message-board">
          {chat &&
            chat.messages.length !== 0 &&
            chat.messages.map((message) => {
              return (
                <Message
                  key={message.sentTime}
                  text={message.text}
                  sentTime={message.sentTime}
                  userId={message.userId}
                  status={message.status}
                  user={user as User}
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
