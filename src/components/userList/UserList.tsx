import { memo, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getUsers, initChat } from "../../redux/chat/chatAPI";
import { AppContext } from "../../context/appContext/AppContext";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./_user-list.scss";
import { Chat, preDefinedChat } from "../../interfaces/chat";
import { User } from "../../interfaces/auth";
import { v4 as uuid } from "uuid";

export const UserList = () => {
  //const [currentReceiver, setCurrentReceiver] = useState({});
  const authContext = useContext(AuthContext);
  const users = useAppSelector((state) => state.chatReducer.users);

  const dispatch = useAppDispatch();

  const startChat = (sender: User, receiver: User) => {
    const receiverObj: User = {
      uid: receiver.uid,
      displayName: receiver.displayName,
      email: receiver.email,
      loggedIn: receiver.loggedIn,
    };
    const chatObj: preDefinedChat = {
      firstUser: sender,
      secondUser: receiverObj,
      messages: [],
      startDate: Date.now(),
    };
    dispatch(initChat(chatObj));
  };

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users.map((user) => {
          if (authContext?.state.user?.uid !== user.uid) {
            return (
              <li
                onClick={() => {
                  startChat(authContext?.state.user as User, user);
                }}
                key={user.uid}
                className="list-item"
              >
                <div
                  className={`is-loggedin-icon ${
                    user.loggedIn ? "logged-in" : "logged-out"
                  }`}
                ></div>
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
