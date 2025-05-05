import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { db } from "../../../../firebase";
import { User } from "../../../interfaces/auth";
import { ChatObj } from "../../../interfaces/chat";
import { getChatById, getUsers, initChat } from "../../../redux/chat/chatAPI";
import { ChatState, updateUser } from "../../../redux/chat/chatSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import { setMessageSeen } from "../../../utils/common-functions";
import "./_user-list.scss";
import ListItem from "./listItem/ListItem";

/**
 * UserList Component
 *
 * This component displays a list of users available for chatting. It allows the current user
 * to select a user to start a chat or continue an existing one. The component also listens
 * for real-time updates to the user list from Firestore.
 *
 * Props:
 * - `user`: The current user object.
 * - `users`: The list of all users fetched from Firestore.
 */
export const UserList = (props: Partial<ChatState>) => {
  const { user: currentUser, users } = props;

  const chats = useAppSelector((state) => state.chatReducer.chats);

  const [listItemActiveUid, setListItemActiveUid] = useState(""); // State to track the active user in the list - the user you are talking with

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  // Set up a Firestore listener to update the user list in real-time
  useEffect(() => {
    const updateUserList = () => {
      const unSub = onSnapshot(collection(db, "users"), (doc) => {
        doc.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              dispatch(getUsers());
              break;
            case "modified":
              dispatch(updateUser(change.doc.data()));
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
    updateUserList();
  }, []);

  /**
   * Opens a chat between the sender and receiver.
   * - If a chat already exists, it fetches the chat by ID.
   * - If no chat exists, it initializes a new chat and updates Firestore.
   *
   * @param sender - The current user initiating the chat.
   * @param receiver - The user to chat with.
   */
  const openChat = (sender: User, receiver: User) => {
    if (sender.chatIds) {
      for (const key in sender.chatIds) {
        if (receiver.chatIds) {
          //If the chat is already exists
          if (receiver.chatIds[key]) {
            dispatch(getChatById(key));
            localStorage.setItem("chatId", key);
            setMessageSeen(chats[key], dispatch, sender); // Stops the green flickering effect on the user name in the user list
            return;
          }
        }
      }
    }
    // Create a new chat if no existing chat is found
    const chatId = uuid(); //firebase method for creating unique id's from the front-end
    localStorage.setItem("chatId", chatId);
    const chatObj: ChatObj = {
      chatId: chatId,
      sender: {
        ...sender,
        chatIds: { ...sender.chatIds, [chatId]: { active: true } },
      },
      receiver: {
        ...receiver,
        chatIds: { ...receiver.chatIds, [chatId]: { active: true } },
      },
      messages: [],
    };
    dispatch(initChat(chatObj));
    setMessageSeen(chats[chatId], dispatch, sender);
  };

  /**
   * Sets the active user in the user list.
   *
   * @param uid - The user ID of the active user.
   */
  const setUserActive = (uid: string) => {
    setListItemActiveUid(uid);
    localStorage.setItem("activeUid", uid);
  };

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users?.map((user) => {
          if (currentUser && currentUser.userId !== user.userId) {
            return (
              <ListItem
                key={user.userId}
                currentUser={currentUser}
                user={user}
                chats={chats}
                openChat={openChat}
                setUserActive={setUserActive}
                listItemActiveUid={listItemActiveUid}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};

export default UserList;
