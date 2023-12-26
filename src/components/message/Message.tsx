import { Message as MessageProps, MessageStatus } from "../../interfaces/chat";
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import "./_message.scss";
import { FaCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";

// interface SentMessage extends MessageProps {
//   firstUserUid: string;
//   secondUserUid: string;
// }

const Message = (props: Partial<MessageProps>) => {
  const user = useAppSelector((state) => state.chatReducer.user);
  const chat = useAppSelector((state) => state.chatReducer.currentChat);
  const { text, sentTime, status = MessageStatus.SENT, userId } = props;
  console.log(userId, user?.uid);
  return (
    <div
      className={`message-container ${
        userId === user?.uid ? "sender" : "reciever"
      }`}
    >
      <div className="message-text-container">{text}</div>
      <div className="message-date-time-container">
        <span>{new Date(sentTime as number).toLocaleString()}</span>
        {status === MessageStatus.SENT && (
          <span>
            <FaCheck />
          </span>
        )}
        {status === MessageStatus.ARRIVED && (
          <span>
            <FaCheckDouble />
          </span>
        )}
        {status === MessageStatus.SEEN && (
          <span style={{ color: "green" }}>
            <FaCheckDouble />
          </span>
        )}
        {chat?.writing && (
          <span>
            <img src="../../assets/gifs/writing.gif" alt="Writing..." />
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
