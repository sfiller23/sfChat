import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { ChatObj } from "../interfaces/chat";
import { ChatState } from "../redux/chat/chatSlice";
import { setMessageSeenReq } from "../redux/chat/chatAPI";
import { User } from "../interfaces/auth";

export const setMessageSeen = (
  chat: ChatObj,
  dispatch: ThunkDispatch<ChatState, undefined, UnknownAction>,
  user: User
) => {
  if (chat) {
    if (chat.messages.length !== 0) {
      if (chat?.messages[chat?.messages.length - 1].userId !== user?.userId) {
        dispatch(setMessageSeenReq(chat.chatId));
      }
    }
  }
};
