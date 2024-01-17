import LoggedInIcon from "../../../../UI/loggedInIcon/loggedInIcon";
import { User } from "../../../../interfaces/auth";
import { Chats } from "../../../../interfaces/chat";
import { ChatState } from "../../../../redux/chat/chatSlice";
import "./_list-item.scss";

interface ListItemProps extends Partial<ChatState> {
  currentUser: User;
  openChat: (sender: User, receiver: User) => void;
  setUserActive: (userId: string) => void;
  isNewMessage: (
    user: User,
    currentUser: User,
    chats: Chats
  ) => string | undefined;
  listItemActiveUid: string;
}

const ListItem = (props: ListItemProps) => {
  const {
    currentUser,
    user,
    chats,
    openChat,
    setUserActive,
    isNewMessage,
    listItemActiveUid,
  } = props;
  const activeUid = localStorage.getItem("activeUid");
  return (
    <li
      onClick={() => {
        openChat(currentUser, user as User);
        setUserActive(user?.userId as string);
      }}
      className={`list-item ${
        (listItemActiveUid === user?.userId && "active") ||
        (activeUid && activeUid === user?.userId && "active")
      } 

           ${
             user?.chatIds &&
             user.userId === isNewMessage(user, currentUser, chats as Chats) &&
             "new-message"
           }`}
    >
      <LoggedInIcon loggedIn={user?.loggedIn} />
      {user?.displayName}
    </li>
  );
};

export default ListItem;
