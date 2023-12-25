import { memo, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getChatByUid, getUsers, initChat } from "../../redux/chat/chatAPI";
import { AppContext } from "../../context/appContext/AppContext";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./_user-list.scss";
import { Chats, ChatObj } from "../../interfaces/chat";
import { User } from "../../interfaces/auth";
import { v4 as uuid } from "uuid";
import {
  addUser,
  setCurrentChat,
  updateUser,
} from "../../redux/chat/chatSlice";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";
import { db } from "../../App";
import { collection, onSnapshot } from "firebase/firestore";

export const UserList = () => {
  //const [currentReceiver, setCurrentReceiver] = useState({});
  const currentUser = useAppSelector((state) => state.chatReducer.user);
  const users = useAppSelector((state) => state.chatReducer.users);

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

  const dispatch = useAppDispatch();

  const startChat = (sender: User, receiver: User) => {
    if (sender.chatIds) {
      for (const key in sender.chatIds) {
        if (receiver.chatIds) {
          if (receiver.chatIds[key]) {
            console.log("existing");
            dispatch(getChatByUid(key));
            return;
          }
        }
      }
    }

    console.log("not existing");
    const uid = uuid();
    //localStorage.setItem("chatId", uid);
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
    console.log(chatObj);
    dispatch(initChat(chatObj));
    //dispatch(setCurrentChat(chatObj));
  };

  // useEffect(() => {
  //   if (users) {
  //     //console.log(users, "from user list");
  //   }
  // }, [users]);

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
