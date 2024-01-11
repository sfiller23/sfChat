import { useEffect, useState } from "react";
import { PiNavigationArrowThin } from "react-icons/pi";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import {
  setMessageSeenReq,
  setWritingState,
  updateChat,
} from "../../../redux/chat/chatAPI";
import {
  ChatState,
  setCurrentChatMessage,
} from "../../../redux/chat/chatSlice";
import { Message as MessageProps } from "../../../interfaces/chat";
import { MessageStatus } from "../../../constants/enums";
import "./_chat-footer.scss";

const ChatFooter = (props: Partial<ChatState>) => {
  const { currentChat: chat, user } = props;

  const [messageText, setMessageText] = useState("");

  const [isChatActive, setIsChatActive] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (chat) {
      setIsChatActive(true);
    }
  }, [chat]);

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

  const setMessageSeen = () => {
    if (chat) {
      if (chat.messages.length !== 0) {
        if (chat?.messages[chat?.messages.length - 1].userId !== user?.userId) {
          dispatch(setMessageSeenReq(chat.chatId));
        }
      }
    }
  };

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
          <span className="chat-input">
            <input
              className="input-box"
              type="text"
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
                setMessageSeen();
              }}
            />
          </span>
          <span onClick={sendMessage} className="send-button-container">
            <PiNavigationArrowThin size={20} className="send-icon" />
          </span>
        </>
      ) : (
        <span className="select-user-container">
          <h3>Please select a user to start messaging</h3>
        </span>
      )}
    </div>
  );
};

export default ChatFooter;
