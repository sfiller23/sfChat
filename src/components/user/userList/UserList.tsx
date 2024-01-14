import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import { getChatById, getUsers, initChat } from "../../../redux/chat/chatAPI";
import "./_user-list.scss";
import { ChatObj, Chats } from "../../../interfaces/chat";
import { User } from "../../../interfaces/auth";
import { v4 as uuid } from "uuid";
import { ChatState, updateUser } from "../../../redux/chat/chatSlice";
import { db } from "../../../App";
import { collection, onSnapshot } from "firebase/firestore";
import { MessageStatus } from "../../../constants/enums";
import ListItem from "./listItem/ListItem";

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

  const startChat = (sender: User, receiver: User) => {
    if (sender.chatIds) {
      for (const key in sender.chatIds) {
        if (receiver.chatIds) {
          if (receiver.chatIds[key]) {
            dispatch(getChatById(key));
            localStorage.setItem("chatId", key);
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
  };

  const setUserActive = (uid: string) => {
    setListItemActiveUid(uid);
    localStorage.setItem("activeUid", uid);
  };

  const isNewMessage = (
    user: User,
    currentUser: User,
    chats: Chats
  ): string | undefined => {
    for (const chatId in user.chatIds) {
      if (chats[chatId]) {
        // if (
        //   chats[chatId].messages &&
        //   chats[chatId].messages.length !== 0 &&
        //   chats[chatId].messages[chats[chatId].messages.length - 1]["status"] &&
        //   chats[chatId].messages[chats[chatId].messages.length - 1].status ===
        //     MessageStatus.ARRIVED &&
        //   chats[chatId].writing?.writerID !== currentUser.userId
        // ) {
        //   return chats[chatId].secondUser.userId;
        // } else {
        //   return chats[chatId].firstUser.userId;
        // }

        if (currentUser.userId === chats[chatId].firstUser.userId) {
          if (
            //chats[chatId].secondUser.userId === user.userId &&
            chats[chatId].messages &&
            chats[chatId].messages.length !== 0 &&
            chats[chatId].messages[chats[chatId].messages.length - 1][
              "status"
            ] &&
            chats[chatId].messages[chats[chatId].messages.length - 1].userId !==
              chats[chatId].firstUser.userId &&
            chats[chatId].messages[chats[chatId].messages.length - 1].status ===
              MessageStatus.ARRIVED
          ) {
            return chats[chatId].secondUser.userId;
          }
        } else if (currentUser.userId === chats[chatId].secondUser.userId) {
          if (
            //chats[chatId].firstUser.userId === user.userId &&
            chats[chatId].messages &&
            chats[chatId].messages.length !== 0 &&
            chats[chatId].messages[chats[chatId].messages.length - 1][
              "status"
            ] &&
            chats[chatId].messages[chats[chatId].messages.length - 1].userId !==
              chats[chatId].secondUser.userId &&
            chats[chatId].messages[chats[chatId].messages.length - 1].status ===
              MessageStatus.ARRIVED
          ) {
            return chats[chatId].firstUser.userId;
          }
        }
      }
    }
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
                startChat={startChat}
                setUserActive={setUserActive}
                isNewMessage={isNewMessage}
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
