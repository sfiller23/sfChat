import { useEffect, useRef } from "react";
import { MessageStatus } from "../../constants/enums";
import { Message as MessageProps } from "../../interfaces/chat";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import "./_message.scss";
import { FaCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";
import { newMessageArrived } from "../../redux/chat/chatSlice";

const Message = (props: Partial<MessageProps>) => {
  const user = useAppSelector((state) => state.chatReducer.user);
  const chats = useAppSelector((state) => state.chatReducer.chats);

  const dispatch = useAppDispatch();

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
    if (chatId && index) {
      if (chats[chatId].messages.length - 1 === index) {
        bottomRef.current?.scrollIntoView();
      }
    }
  }, []);

  return (
    <div
      ref={bottomRef}
      className={`message-container ${
        userId === user?.userId ? "sender" : "reciever"
      }`}
    >
      <div className="message-text-container">{text}</div>
      <div className="message-date-time-container">
        <span>{new Date(sentTime as number).toLocaleString()}</span>
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
