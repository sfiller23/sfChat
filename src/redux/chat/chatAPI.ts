import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../App";
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
import { Chats, ChatObj, Message, MessageStatus } from "../../interfaces/chat";

export const setWritingState = createAsyncThunk(
  "setWritingState",
  async (args: { isWriting: boolean; uid: string; writerID: string }) => {
    await updateDoc(doc(db, "chats", args.uid), {
      writing: { status: args.isWriting, writerID: args.writerID },
    });
  }
);

export const setMessageSeenReq = createAsyncThunk(
  "setMessageSeen",
  async (uid: string) => {
    const q = query(collection(db, "chats"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let chat: Partial<ChatObj> = {};
    querySnapshot.forEach((doc) => {
      chat = { uid: doc.id, ...doc.data() };
    });
    if (chat.messages) {
      chat.messages[chat.messages.length - 1].status = MessageStatus.SEEN;
      await updateDoc(doc(db, "chats", uid), {
        messages: chat.messages,
      });
    }
  }
);

export const updateChat = createAsyncThunk(
  "updateChat",
  async (args: { uid: string; message: Message }) => {
    try {
      if (args.uid) {
        await updateDoc(doc(db, "chats", args.uid), {
          messages: arrayUnion(args.message),
        });
        const q = query(collection(db, "chats"), where("uid", "==", args.uid));
        const querySnapshot = await getDocs(q);
        let chat: Partial<ChatObj> = {};
        querySnapshot.forEach((doc) => {
          chat = { uid: doc.id, ...doc.data() };
        });
        if (chat.messages) {
          chat.messages[chat.messages.length - 1].status =
            MessageStatus.ARRIVED;
          await updateDoc(doc(db, "chats", args.uid), {
            messages: chat.messages,
          });
        }
      }
    } catch (error) {
      alert(`${error} In updateChat`);
    }
  }
);

export const getChatByUid = createAsyncThunk(
  "getChatByUid",
  async (uid: string) => {
    try {
      const q = query(collection(db, "chats"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      let chat: Partial<ChatObj> = {};
      querySnapshot.forEach((doc) => {
        chat = { uid: doc.id, ...doc.data() };
      });
      return chat;
    } catch (error) {
      alert(`${error} In getChatByUid`);
    }
  }
);

export const getUserByUid = createAsyncThunk(
  "getUserByUid",
  async (uid: string) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      let user = {};
      querySnapshot.forEach((doc) => {
        user = { uid: doc.id, ...doc.data() };
      });
      return user;
    } catch (error) {
      alert(`${error} In getUserByUid`);
    }
  }
);

export const getUsers = createAsyncThunk("getUsers", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersArray: User[] = [];
    querySnapshot.forEach((doc) => {
      usersArray.push({ uid: doc.id, ...doc.data() } as User);
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
      await setDoc(doc(db, "chats", chatObj.uid), {
        uid: chatObj.uid,
        firstUser: chatObj.firstUser,
        secondUser: chatObj.secondUser,
        messages: chatObj.messages,
      });
      await updateDoc(doc(db, "users", chatObj.firstUser.uid), {
        chatIds: chatObj.firstUser.chatIds,
      });
      await updateDoc(doc(db, "users", chatObj.secondUser.uid), {
        chatIds: chatObj.secondUser.chatIds,
      });
      thunkApi.dispatch(getUsers());
      thunkApi.dispatch(getUserByUid(chatObj.firstUser.uid));
      await setDoc(doc(db, "chatIds", chatObj.uid), {
        chatId: chatObj.uid,
      });
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
