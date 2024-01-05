import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import {
  getChatByUid,
  getUsers,
  initChat,
  setNewMessageState,
} from "../../redux/chat/chatAPI";
import "./_user-list.scss";
import { ChatObj } from "../../interfaces/chat";
import { User } from "../../interfaces/auth";
import { v4 as uuid } from "uuid";
import { updateUser } from "../../redux/chat/chatSlice";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";
import { db } from "../../App";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export const UserList = () => {
  const currentUser = useAppSelector((state) => state.chatReducer.user);
  const users = useAppSelector((state) => state.chatReducer.users);

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
    console.log(sender, "from start chat");
    console.log(receiver, "from start chat");
    if (sender.chatIds) {
      for (const key in sender.chatIds) {
        if (receiver.chatIds) {
          if (receiver.chatIds[key]) {
            console.log("geting the chat", key);
            dispatch(getChatByUid(key));
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

  const activeUid = localStorage.getItem("activeUid");

  const onUserClick = (uid: string) => {
    setListItemActiveUid(uid);
    localStorage.setItem("activeUid", uid);
  };

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users.map((user) => {
          if (currentUser && currentUser.userId !== user.userId) {
            return (
              // <Link key={user.userId} to={user.userId}>
              <li
                key={user.userId}
                onClick={() => {
                  startChat(
                    users.filter(
                      (user) => user.userId === currentUser.userId
                    )[0],
                    user
                  );
                  onUserClick(user.userId);
                }}
                className={`list-item ${
                  (listItemActiveUid === user.userId && "active") ||
                  (activeUid && activeUid === user.userId && "active")
                } 

                   ${user.newMessage && "new-message"}`}
              >
                <LoggedInIcon loggedIn={user.loggedIn} />
                {user.displayName}
              </li>
              // </Link>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default UserList;
