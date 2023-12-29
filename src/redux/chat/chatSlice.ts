import { createSlice } from "@reduxjs/toolkit";
import {
  getChatByUid,
  getChats,
  getUserByUid,
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(getChatByUid.fulfilled, (state, action) => {
        state.currentChat = action.payload as ChatObj;
      })
      .addCase(initChat.fulfilled, (state, action) => {
        state.currentChat = action.payload as ChatObj;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload as User[];
      })
      .addCase(getUserByUid.fulfilled, (state, action) => {
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
  setCurrentChat,
  setCurrentChatMessage,
  addUser,
  updateUser,
} = chatSlice.actions;

export default chatSlice.reducer;
