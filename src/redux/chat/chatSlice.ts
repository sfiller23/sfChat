import { createSlice } from "@reduxjs/toolkit";
import { getUsers } from "./chatAPI";
import { User } from "../../interfaces/auth";
import { Chat } from "../../interfaces/chat";

export interface ChatState {
  users: User[];
  chats: Chat[];
  status: string;
}

const initialState: ChatState = {
  users: [],
  chats: [],
  status: "",
};

const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    searchUser: (state, action) => {
      state.users = state.users.filter((user) =>
        user.displayName.startsWith(action.payload)
      );
    },
    startChat: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(getUsers.fulfilled, (state, action: any) => {
        state.status = "Success";
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action: any) => {
        state.status = "Failed!";
        state.status = action.payload;
      });
  },
});

export const { searchUser } = chatSlice.actions;

export default chatSlice.reducer;
