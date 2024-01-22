import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { ChatObj, Chats } from "../interfaces/chat";
import { ChatState } from "../redux/chat/chatSlice";
import { setMessageSeenReq } from "../redux/chat/chatAPI";
import { User } from "../interfaces/auth";
import { MessageStatus } from "../constants/enums";

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

export const isNewMessage = (
  user: User,
  currentUser: User,
  chats: Chats
): string | undefined => {
  if (user && currentUser) {
    for (const chatId in user.chatIds) {
      if (chats[chatId]) {
        if (currentUser.userId === chats[chatId].sender.userId) {
          if (
            chats[chatId].messages &&
            chats[chatId].messages.length !== 0 &&
            chats[chatId].messages[chats[chatId].messages.length - 1][
              "status"
            ] &&
            chats[chatId].messages[chats[chatId].messages.length - 1].userId !==
              chats[chatId].sender.userId &&
            chats[chatId].messages[chats[chatId].messages.length - 1].status ===
              MessageStatus.ARRIVED
          ) {
            return chats[chatId].receiver.userId;
          }
        } else if (currentUser.userId === chats[chatId].receiver.userId) {
          if (
            chats[chatId].messages &&
            chats[chatId].messages.length !== 0 &&
            chats[chatId].messages[chats[chatId].messages.length - 1][
              "status"
            ] &&
            chats[chatId].messages[chats[chatId].messages.length - 1].userId !==
              chats[chatId].receiver.userId &&
            chats[chatId].messages[chats[chatId].messages.length - 1].status ===
              MessageStatus.ARRIVED
          ) {
            return chats[chatId].sender.userId;
          }
        }
      }
    }
  }
};
