import Card from "../../UI/card/Card";
import "./_home.scss";
import { useEffect, useState } from "react";
import UserList from "../../components/user/userList/UserList";
import UserSearch from "../../components/user/userSearch/UserSearch";
import Chat from "../../components/chat/Chat";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { getChats } from "../../redux/chat/chatAPI";
import UserHeader from "../../components/user/userHeader/UserHeader";
import { User } from "../../interfaces/auth";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { isNewMessage } from "../../utils/common-functions";

const Home = () => {
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state) => state.chatReducer.user);

  const users = useAppSelector((state) => state.chatReducer.users);

  const chats = useAppSelector((state) => state.chatReducer.chats);

  const [user, setUser] = useState<User>();
  const [toggleCollapseButton, setToggleCollapseButton] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    dispatch(getChats());
  }, []);

  useEffect(() => {
    setNewMessage(!!isNewMessage(user as User, user as User, chats));
  }, [user]);

  useEffect(() => {
    if (authUser?.userId) {
      setUser(users.filter((user) => user.userId === authUser?.userId)[0]);
    }
  }, [authUser?.userId, users]);

  return (
    <Card classNames={["chat-card"]}>
      <span
        className={`users-container ${toggleCollapseButton ? "open" : "close"}`}
      >
        <UserHeader user={user} />
        <UserSearch />
        <UserList user={user} users={users} />
      </span>
      <span
        className={`collapse-button-container ${
          toggleCollapseButton && "open"
        } `}
      >
        <button
          onClick={() => setToggleCollapseButton((s) => !s)}
          className={`collapse-button ${
            newMessage && toggleCollapseButton ? "new-message" : ""
          }`}
        >
          <TbLayoutSidebarLeftCollapseFilled
            className={`collapse-icon ${
              toggleCollapseButton ? "open" : "close"
            }`}
          />
        </button>
      </span>
      <span className="chat-container">
        <Chat user={user} />
      </span>
    </Card>
  );
};

export default Home;
