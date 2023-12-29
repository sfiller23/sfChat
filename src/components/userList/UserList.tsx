import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getChatByUid, getUsers, initChat } from "../../redux/chat/chatAPI";
import "./_user-list.scss";
import { ChatObj } from "../../interfaces/chat";
import { User } from "../../interfaces/auth";
import { v4 as uuid } from "uuid";
import { updateUser } from "../../redux/chat/chatSlice";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";
import { db } from "../../App";
import { collection, onSnapshot } from "firebase/firestore";

export const UserList = () => {
  const currentUser = useAppSelector((state) => state.chatReducer.user);
  const users = useAppSelector((state) => state.chatReducer.users);

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
            dispatch(getChatByUid(key));
            localStorage.setItem("chatId", key);
            return;
          }
        }
      }
    }

    const uid = uuid();
    localStorage.setItem("chatId", uid);
    const chatObj: ChatObj = {
      uid,
      firstUser: {
        ...sender,
        chatIds: { ...sender.chatIds, [uid]: { active: true } },
      },
      secondUser: {
        ...receiver,
        chatIds: { ...receiver.chatIds, [uid]: { active: true } },
      },
      messages: [],
    };
    dispatch(initChat(chatObj));
  };

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users.map((user) => {
          if (currentUser && currentUser.uid !== user.uid) {
            return (
              <li
                onClick={() => {
                  startChat(currentUser, user);
                }}
                key={user.uid}
                className="list-item"
              >
                <LoggedInIcon loggedIn={user.loggedIn} />
                {user.displayName}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default UserList;
