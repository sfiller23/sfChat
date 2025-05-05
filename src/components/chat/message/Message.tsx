import { useEffect, useRef } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa6";
import { MessageStatus } from "../../../constants/enums";
import { Message as MessageProps } from "../../../interfaces/chat";
import "./_message.scss";

/**
 * Message Component
 *
 * This component represents a single chat message. It displays the message text,
 * timestamp, and status (e.g., sent, arrived, seen). It also differentiates between
 * messages sent by the current user and received from others.
 *
 * Props:
 * - `text`: The content of the message.
 * - `sentTime`: The timestamp when the message was sent.
 * - `status`: The delivery status of the message (default is `SENT`).
 * - `userId`: The ID of the user who sent the message.
 * - `user`: The current user object.
 */
const Message = (props: Partial<MessageProps>) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { text, sentTime, status = MessageStatus.SENT, userId, user } = props;

  useEffect(() => {
    // makes sure the message is visible
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current]);

  return (
    <div
      ref={bottomRef}
      className={`message-container ${
        //If the message user ID is mine, I’m sending it.
        userId === user?.userId ? "sender" : "receiver"
      }`}
    >
      <div className="message-text-container">
        <p>{text}</p>
      </div>
      <div className="message-date-time-container">
        <p>{new Date(sentTime as number).toLocaleString()}</p>
        {/* Display the message status icons for messages sent by the current user */}
        {userId === user?.userId && (
          <span>
            {status === MessageStatus.SENT && (
              <span>
                <FaCheck />
                {/* Single checkmark for "Sent" */}
              </span>
            )}
            {status === MessageStatus.ARRIVED && (
              <span>
                <FaCheckDouble />
                {/* Double checkmarks for "Arrived" */}
              </span>
            )}
            {status === MessageStatus.SEEN && (
              <span style={{ color: "#7ca67c" }}>
                <FaCheckDouble />
                {/* Green double checkmarks for "Seen" */}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
