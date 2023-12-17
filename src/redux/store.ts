import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./chat/chatSlice";

export const store = configureStore({
  reducer: {
    chatReducer: chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
