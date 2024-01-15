import LoggedInIcon from "../../../UI/loggedInIcon/loggedInIcon";
import { ChatState } from "../../../redux/chat/chatSlice";
import { useAppSelector } from "../../../redux/hooks/reduxHooks";
import "./_chat-header.scss";

const ChatHeader = (props: Partial<ChatState>) => {
  const { currentChat: chat, user } = props;

  const users = useAppSelector((state) => state.chatReducer.users);
  return (
    <div className="chat-header">
      <>
        {chat?.writing?.status && chat.writing.writerID !== user?.userId && (
          <span className="writing-gif-container">
            <img src="/writing.gif" alt="Writing..." />
          </span>
        )}
        {chat &&
          (chat.firstUser.userId !== user?.userId ? (
            <>
              <span className="logged-in-icon-container">
                {" "}
                <LoggedInIcon
                  loggedIn={
                    users.find((user) => user.userId === chat.firstUser.userId)
                      ?.loggedIn
                  }
                />
              </span>
              <span>
                <h3>{chat.firstUser.displayName}</h3>
              </span>
            </>
          ) : (
            <>
              <span className="logged-in-icon-container">
                <LoggedInIcon
                  loggedIn={
                    users.find((user) => user.userId === chat.secondUser.userId)
                      ?.loggedIn
                  }
                />
              </span>
              <span>
                <h3>{chat.secondUser.displayName}</h3>
              </span>
            </>
          ))}
      </>
    </div>
  );
};

export default ChatHeader;
