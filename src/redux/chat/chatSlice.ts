import { createSlice } from "@reduxjs/toolkit";
import {
  getChats,
  getUserByUid,
  getUsers,
  initChat,
  updateChat,
} from "./chatAPI";
import { User } from "../../interfaces/auth";
import { Chats, ChatObj, ActiveChats } from "../../interfaces/chat";

export interface ChatState {
  user: User | null;
  users: User[];
  chats: Chats;
  activeChats: ActiveChats | null;
  currentChat: ChatObj | null;
  chatUpdated: boolean;
}

const initialState: ChatState = {
  user: null,
  users: [],
  chats: {},
  activeChats: null,
  currentChat: null,
  chatUpdated: false,
};

const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
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
      .addCase(updateChat.fulfilled, (state) => {
        state.chatUpdated = !state.chatUpdated;
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
} = chatSlice.actions;

export default chatSlice.reducer;
