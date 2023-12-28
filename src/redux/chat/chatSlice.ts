import { createSlice } from "@reduxjs/toolkit";
import {
  getChatByUid,
  getChats,
  getUserByUid,
  getUsers,
  initChat,
  updateChat,
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
    clearChat: (state) => {
      state = initialState;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const userIndex = state.users
        .map((user) => user.uid)
        .indexOf(action.payload.uid);
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
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    startChat: (state, action) => {},
  },

  extraReducers: (builder) => {
    builder
      .addCase(getChatByUid.fulfilled, (state, action: any) => {
        state.currentChat = action.payload;
      })
      .addCase(initChat.fulfilled, (state, action: any) => {
        state.currentChat = action.payload;
      })
      .addCase(getUsers.fulfilled, (state, action: any) => {
        state.users = action.payload;
      })
      .addCase(getUserByUid.fulfilled, (state, action: any) => {
        state.user = action.payload;
      })
      .addCase(getChats.pending, (state) => {})
      .addCase(getChats.fulfilled, (state, action: any) => {
        state.chats = action.payload;
      })
      .addCase(getChats.rejected, (state, action: any) => {});
  },
});

export const {
  searchUser,
  setAuthenticatedUser,
  startChat,
  setCurrentChat,
  setCurrentChatMessage,
  addUser,
  updateUser,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
