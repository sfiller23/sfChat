import { createSlice } from "@reduxjs/toolkit";

export interface ChatState {
  chat: [];
  status: string;
}

const initialState: ChatState = {
  chat: [],
  status: "",
};

const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {},
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(getCategories.pending, (state, action) => {
  //         state.status = "Loading...";
  //       })
  //       .addCase(getCategories.fulfilled, (state, action: any) => {
  //         state.status = "Success";
  //         state.categories = action.payload;
  //       })
  //       .addCase(getCategories.rejected, (state, action: any) => {
  //         state.status = "Failed!";
  //         state.error = action.error.message;
  //       });
  //   },
});

export default chatSlice.reducer;
