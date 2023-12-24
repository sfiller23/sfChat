import { memo, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getUsers, initChat } from "../../redux/chat/chatAPI";
import { AppContext } from "../../context/appContext/AppContext";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./_user-list.scss";
import { Chats, ChatObj } from "../../interfaces/chat";
import { User } from "../../interfaces/auth";
import { v4 as uuid } from "uuid";
import { setCurrentChat } from "../../redux/chat/chatSlice";
import LoggedInIcon from "../../UI/loggedInIcon/loggedInIcon";

export const UserList = () => {
  //const [currentReceiver, setCurrentReceiver] = useState({});
  const currentUser = useAppSelector((state) => state.chatReducer.user);
  const users = useAppSelector((state) => state.chatReducer.users);
  const chats = useAppSelector((state) => state.chatReducer.chats);

  const dispatch = useAppDispatch();

  const startChat = (sender: User, receiver: User) => {
    const chatId = localStorage.getItem("chatId");
    if (chatId) {
      console.log(chatId, "existing");
      for (const key in chats) {
        if (
          (chats[key].firstUser.uid === sender.uid &&
            chats[key].secondUser.uid === receiver.uid) ||
          (chats[key].firstUser.uid === receiver.uid &&
            chats[key].secondUser.uid === sender.uid)
        ) {
          dispatch(setCurrentChat({ ...chats[key], uid: key }));
        }
      }
    } else {
      console.log("not existing");
      const uid = uuid();
      localStorage.setItem("chatId", uid);
      const chatObj: ChatObj = {
        uid,
        firstUser: sender,
        secondUser: receiver,
        messages: [],
      };
      dispatch(initChat(chatObj));
      dispatch(setCurrentChat(chatObj));
    }
  };

  useEffect(() => {
    dispatch(getUsers());
  }, []);

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

export default memo(UserList);
