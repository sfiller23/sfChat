import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "../../interfaces/auth";
import { Chats, ChatObj, Message } from "../../interfaces/chat";
import { MessageStatus } from "../../constants/enums";

export const setWritingState = createAsyncThunk(
  "setWritingState",
  async (args: { isWriting: boolean; chatId: string; writerID: string }) => {
    await updateDoc(doc(db, "chats", args.chatId), {
      writing: { status: args.isWriting, writerID: args.writerID },
    });
  }
);

// export const setNewMessageState = createAsyncThunk(
//   "setNewMessageState",
//   async (args: { userId: string; state: boolean }) => {
//     await updateDoc(doc(db, "users", args.userId), {
//       newMessage: args.state,
//     });
//   }
// );

export const setMessageSeenReq = createAsyncThunk(
  "setMessageSeen",
  async (chatId: string) => {
    const q = query(collection(db, "chats"), where("chatId", "==", chatId));
    const querySnapshot = await getDocs(q);
    let chat: Partial<ChatObj> = {};
    querySnapshot.forEach((doc) => {
      chat = { chatId: doc.id, ...doc.data() };
    });
    if (chat.messages) {
      chat.messages.forEach((message) => {
        message.status = MessageStatus.SEEN;
      });
      await updateDoc(doc(db, "chats", chatId), {
        messages: chat.messages,
      });
    }
  }
);

export const updateChat = createAsyncThunk(
  "updateChat",
  async (args: { chatId: string; message: Message }) => {
    try {
      if (args.chatId) {
        await updateDoc(doc(db, "chats", args.chatId), {
          messages: arrayUnion(args.message),
        });
        const q = query(
          collection(db, "chats"),
          where("chatId", "==", args.chatId)
        );
        const querySnapshot = await getDocs(q);
        let chat: Partial<ChatObj> = {};
        querySnapshot.forEach((doc) => {
          chat = { chatId: doc.id, ...doc.data() };
        });
        if (chat.messages) {
          chat.messages[chat.messages.length - 1].status =
            MessageStatus.ARRIVED;
          await updateDoc(doc(db, "chats", args.chatId), {
            messages: chat.messages,
          });
        }
      }
    } catch (error) {
      alert(`${error} In updateChat`);
    }
  }
);

export const getChatById = createAsyncThunk(
  "getChatById",
  async (chatId: string) => {
    try {
      const q = query(collection(db, "chats"), where("chatId", "==", chatId));
      const querySnapshot = await getDocs(q);
      let chat: Partial<ChatObj> = {};
      querySnapshot.forEach((doc) => {
        chat = { chatId: doc.id, ...doc.data() };
      });
      return chat;
    } catch (error) {
      alert(`${error} In getChatById`);
    }
  }
);

export const getUserById = createAsyncThunk(
  "getUserById",
  async (userId: string) => {
    try {
      const q = query(collection(db, "users"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      let user: Partial<User> = {};
      querySnapshot.forEach((doc) => {
        user = { userId: doc.id, ...doc.data() };
      });
      return user;
    } catch (error) {
      alert(`${error} In getUserById`);
    }
  }
);

export const getUsers = createAsyncThunk("getUsers", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersArray: User[] = [];
    querySnapshot.forEach((doc) => {
      usersArray.push({ userId: doc.id, ...doc.data() } as User);
    });
    return usersArray;
  } catch (error) {
    alert(`${error} In getDocs`);
  }
});

export const initChat = createAsyncThunk(
  "initChat",
  async (chatObj: ChatObj, thunkApi) => {
    try {
      await setDoc(doc(db, "chats", chatObj.chatId), {
        chatId: chatObj.chatId,
        firstUser: chatObj.firstUser,
        secondUser: chatObj.secondUser,
        messages: chatObj.messages,
      });
      await updateDoc(doc(db, "users", chatObj.firstUser.userId), {
        chatIds: chatObj.firstUser.chatIds,
      });
      await updateDoc(doc(db, "users", chatObj.secondUser.userId), {
        chatIds: chatObj.secondUser.chatIds,
      });
      thunkApi.dispatch(getUsers());
      thunkApi.dispatch(getUserById(chatObj.firstUser.userId));
      return chatObj;
    } catch (error) {
      alert(`${error} In initChat`);
    }
  }
);

export const getChats = createAsyncThunk("getChats", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "chats"));
    let chatObj: Partial<Chats> = {};
    querySnapshot.forEach((doc) => {
      chatObj = { ...chatObj, [doc.id]: { ...doc.data() } } as Chats;
    });
    return chatObj;
  } catch (error) {
    alert(`${error} In getChats`);
  }
});
