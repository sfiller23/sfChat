import { createSlice } from "@reduxjs/toolkit";
import {
  getChatById,
  getChats,
  getUserById,
  getUsers,
  initChat,
} from "./chatAPI";
import { User } from "../../interfaces/auth";
import { Chats, ChatObj } from "../../interfaces/chat";

export interface ChatState {
  user: User | null;
  users: User[];
  chats: Chats;
  currentChat: ChatObj | null;
}

const initialState: ChatState = {
  user: null,
  users: [],
  chats: {},
  currentChat: null,
};

const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    updateCurrentChat: (state, action) => {
      state.chats[action.payload.chatId] = action.payload;
    },
    updateUser: (state, action) => {
      const userIndex = state.users
        .map((user) => user.userId)
        .indexOf(action.payload.userId);
      state.users[userIndex] = action.payload;
    },
    setCurrentChatMessage: (state, action) => {
      state.currentChat?.messages.push(action.payload);
    },
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload;
    },
    searchUser: (state, action) => {
      state.users = state.users.filter((user) =>
        user.displayName.startsWith(action.payload)
      );
    },
    clearChat: (state) => {
      state.user = null;
      state.users = [];
      state.chats = {};
      state.currentChat = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getChatById.fulfilled, (state, action) => {
        state.currentChat = action.payload as ChatObj;
      })
      .addCase(initChat.fulfilled, (state, action) => {
        state.currentChat = action.payload as ChatObj;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload as User[];
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload as User;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.chats = action.payload as Chats;
      });
  },
});

export const {
  searchUser,
  setAuthenticatedUser,
  setCurrentChatMessage,
  updateUser,
  clearChat,
  updateCurrentChat,
} = chatSlice.actions;

export default chatSlice.reducer;
