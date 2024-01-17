import { useEffect, useRef } from "react";
import { MessageStatus } from "../../../constants/enums";
import { Message as MessageProps } from "../../../interfaces/chat";
import { useAppSelector } from "../../../redux/hooks/reduxHooks";
import "./_message.scss";
import { FaCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";

const Message = (props: Partial<MessageProps>) => {
  const user = useAppSelector((state) => state.chatReducer.user);
  const chats = useAppSelector((state) => state.chatReducer.chats);

  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    text,
    sentTime,
    status = MessageStatus.SENT,
    userId,
    index,
    chatId,
  } = props;

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [chatId, chats[chatId as string], index, bottomRef.current]);

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
