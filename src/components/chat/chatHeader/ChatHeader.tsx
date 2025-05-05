import LoggedInIcon from "../../../UI/loggedInIcon/loggedInIcon";
import { ChatState } from "../../../redux/chat/chatSlice";
import { useAppSelector } from "../../../redux/hooks/reduxHooks";
import "./_chat-header.scss";

/**
 * ChatHeader Component
 *
 * This component displays the header of the chat, including the name of the chat participant,
 * their online status, and a typing indicator if the other user is typing.
 *
 * Props:
 * - `currentChat`: The currently active chat object.
 * - `user`: The current user object.
 */
const ChatHeader = (props: Partial<ChatState>) => {
  const { currentChat: chat, user } = props;

  const users = useAppSelector((state) => state.chatReducer.users);
  return (
    <div className="chat-header">
      <>
        {/* Display a typing indicator if the other user is typing - if a chat participant typing and its not me */}
        {chat?.writing?.status && chat.writing.writerID !== user?.userId && (
          <span className="writing-gif-container">
            <img src="/writing.gif" alt="Writing..." />
          </span>
        )}
        {/* Display the chat participant's name and online status - if the sender is not me */}
        {chat &&
          (chat.sender.userId !== user?.userId ? (
            <>
              <span className="logged-in-icon-container">
                {" "}
                <LoggedInIcon
                  loggedIn={
                    users.find((user) => user.userId === chat.sender.userId)
                      ?.loggedIn
                  }
                />
              </span>
              <span>
                <h3>{chat.sender.displayName}</h3>
              </span>
            </>
          ) : (
            <>
              <span className="logged-in-icon-container">
                <LoggedInIcon
                  loggedIn={
                    users.find((user) => user.userId === chat.receiver.userId)
                      ?.loggedIn
                  }
                />
              </span>
              <span>
                <h3>{chat.receiver.displayName}</h3>
              </span>
            </>
          ))}
      </>
    </div>
  );
};

export default ChatHeader;
