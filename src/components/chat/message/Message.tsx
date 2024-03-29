import { useEffect, useRef } from "react";
import { MessageStatus } from "../../../constants/enums";
import { Message as MessageProps } from "../../../interfaces/chat";
import "./_message.scss";
import { FaCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";

const Message = (props: Partial<MessageProps>) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { text, sentTime, status = MessageStatus.SENT, userId, user } = props;

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current]);

  return (
    <div
      ref={bottomRef}
      className={`message-container ${
        userId === user?.userId ? "sender" : "reciever"
      }`}
    >
      <div className="message-text-container">
        <p>{text}</p>
      </div>
      <div className="message-date-time-container">
        <p>{new Date(sentTime as number).toLocaleString()}</p>

        {userId === user?.userId && (
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
