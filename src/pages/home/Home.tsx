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

const Home = () => {
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state) => state.chatReducer.user);

  const users = useAppSelector((state) => state.chatReducer.users);

  const [user, setUser] = useState<User>();

  useEffect(() => {
    dispatch(getChats());
  }, []);

  useEffect(() => {
    if (authUser?.userId) {
      setUser(users.filter((user) => user.userId === authUser?.userId)[0]);
    }
  }, [authUser?.userId, users]);

  // useEffect(() => {
  //   const updateChatIds = () => {
  //     const unSub = onSnapshot(collection(db, "chatIds"), (doc) => {
  //       doc.docChanges().forEach((change) => {
  //         switch (change.type) {
  //           case "added":
  //             dispatch(getChats());
  //             dispatch(getUsers());

  //             break;
  //           case "modified":
  //             break;
  //           default:
  //             return;
  //         }
  //       });
  //     });

  //     return () => {
  //       unSub();
  //     };
  //   };
  //   updateChatIds();
  // }, []);

  return (
    <Card classNames={["chat-card"]}>
      <span className="users-container">
        <UserHeader user={user} />
        <UserSearch />
        <UserList user={user} users={users} />
      </span>
      <span className="chat-container">
        <Chat user={user} />
      </span>
    </Card>
  );
};

export default Home;
