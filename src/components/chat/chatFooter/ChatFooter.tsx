import { useEffect, useRef, useState } from "react";
import { PiNavigationArrowThin } from "react-icons/pi";
import { MessageStatus } from "../../../constants/enums";
import { User } from "../../../interfaces/auth";
import { ChatObj, Message as MessageProps } from "../../../interfaces/chat";
import { setWritingState, updateChat } from "../../../redux/chat/chatAPI";
import {
  ChatState,
  setCurrentChatMessage,
} from "../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import { setMessageSeen } from "../../../utils/common-functions";
import "./_chat-footer.scss";

/**
 * ChatFooter Component
 *
 * This component provides the input area for sending messages in a chat.
 * It handles user interactions such as typing, sending messages, and marking messages as seen.
 *
 * Props:
 * - `currentChat`: The currently active chat object.
 * - `user`: The current user object.
 */
const ChatFooter = (props: Partial<ChatState>) => {
  const { currentChat: chat, user } = props;

  const [messageText, setMessageText] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);

  const bottomRef = useRef<HTMLSpanElement>(null); // Ref to scroll to the bottom of the chat

  // Scroll to the bottom of the chat when the component mounts or updates (when getting a new message or opening other chat)
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current]);

  const dispatch = useAppDispatch();

  // Set the chat as active if a chat object is provided
  useEffect(() => {
    if (chat) {
      setIsChatActive(true);
    }
  }, [chat]);

  /**
   * Updates the "writing" state in the chat.
   *
   * @param isWritingMode - Whether the user is currently typing.
   */
  const setWriting = (isWritingMode: boolean) => {
    if (chat && user) {
      dispatch(
        setWritingState({
          isWriting: isWritingMode,
          chatId: chat.chatId,
          writerID: user?.userId,
        })
      );
    }
  };

  /**
   * Sends a message in the chat.
   * - Updates the "writing" state to false.
   * - Dispatches the message to the Redux store and updates the chat in Firestore.
   */
  const sendMessage = () => {
    setWriting(false);
    if (user) {
      const messageObj: MessageProps = {
        displayName: user.displayName,
        userId: user.userId,
        text: messageText,
        sentTime: Date.now(),
        status: MessageStatus.SENT,
      };
      dispatch(setCurrentChatMessage(messageObj));
      if (chat) {
        if (chat.chatId) {
          dispatch(updateChat({ chatId: chat.chatId, message: messageObj }));
        }
      }

      setMessageText("");
    }
  };

  return (
    <div className="chat-footer">
      {isChatActive ? (
        <>
          <textarea
            className="input-box"
            placeholder="Enter Message..."
            value={messageText}
            onInput={() => {
              setWriting(true);
            }}
            onMouseLeave={() => {
              setWriting(false);
            }}
            onChange={(e) => {
              if (e.target.value === "" || e.target.value === undefined) {
                setWriting(false);
              }
              setMessageText(e.target.value);
            }}
            onFocus={() => {
              setMessageSeen(chat as ChatObj, dispatch, user as User);
            }}
          />

          <button
            onClick={sendMessage}
            disabled={messageText ? false : true}
            className="send-button"
          >
            <PiNavigationArrowThin size={20} className="send-icon" />
          </button>
        </>
      ) : (
        <span ref={bottomRef} className="select-user-container">
          <h3>Please select a user to start messaging</h3>
        </span>
      )}
    </div>
  );
};

export default ChatFooter;
