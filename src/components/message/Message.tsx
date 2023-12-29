import { Message as MessageProps, MessageStatus } from "../../interfaces/chat";
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import "./_message.scss";
import { FaCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";

const Message = (props: Partial<MessageProps>) => {
  const user = useAppSelector((state) => state.chatReducer.user);

  const { text, sentTime, status = MessageStatus.SENT, userId } = props;

  return (
    <div
      className={`message-container ${
        userId === user?.uid ? "sender" : "reciever"
      }`}
    >
      <div className="message-text-container">{text}</div>
      <div className="message-date-time-container">
        <span>{new Date(sentTime as number).toLocaleString()}</span>
        {userId === user?.uid && (
          <span>
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
              <span style={{ color: "#7ca67c" }}>
                <FaCheckDouble />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
