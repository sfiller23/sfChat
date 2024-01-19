import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import { getChatById, getUsers, initChat } from "../../../redux/chat/chatAPI";
import "./_user-list.scss";
import { ChatObj } from "../../../interfaces/chat";
import { User } from "../../../interfaces/auth";
import { v4 as uuid } from "uuid";
import { ChatState, updateUser } from "../../../redux/chat/chatSlice";
import { db } from "../../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ListItem from "./listItem/ListItem";
import { setMessageSeen } from "../../../utils/common-functions";

export const UserList = (props: Partial<ChatState>) => {
  const { user: currentUser, users } = props;

  const chats = useAppSelector((state) => state.chatReducer.chats);

  const [listItemActiveUid, setListItemActiveUid] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

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

  const openChat = (sender: User, receiver: User) => {
    if (sender.chatIds) {
      for (const key in sender.chatIds) {
        if (receiver.chatIds) {
          if (receiver.chatIds[key]) {
            dispatch(getChatById(key));
            localStorage.setItem("chatId", key);
            setMessageSeen(chats[key], dispatch, sender);
            return;
          }
        }
      }
    }

    const chatId = uuid();
    localStorage.setItem("chatId", chatId);
    const chatObj: ChatObj = {
      chatId: chatId,
      firstUser: {
        ...sender,
        chatIds: { ...sender.chatIds, [chatId]: { active: true } },
      },
      secondUser: {
        ...receiver,
        chatIds: { ...receiver.chatIds, [chatId]: { active: true } },
      },
      messages: [],
    };
    dispatch(initChat(chatObj));
    setMessageSeen(chats[chatId], dispatch, sender);
  };

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
