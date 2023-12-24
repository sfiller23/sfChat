import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../App";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "../../interfaces/auth";
import { Chat, ChatObj, Message, preDefinedChat } from "../../interfaces/chat";
import { v4 as uuid } from "uuid";
// continiue from here adjust the update doc func and make it get the right input that will be an object. adjust to the sendMessage func from the right
export const updateChat = createAsyncThunk(
  "updateChat",
  async (args: { uid: string; messages: Message[] }) => {
    try {
      if (args.uid) {
        console.log("updating");
        await updateDoc(doc(db, "chats", args.uid), {
          messages: args.messages,
        });
      }
    } catch (error) {
      alert(`${error} In updateChat`);
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
  async (chatObj: ChatObj) => {
    try {
      await setDoc(doc(db, "chats", chatObj.uid), {
        firstUser: chatObj.firstUser,
        secondUser: chatObj.secondUser,
        messages: chatObj.messages,
      });
    } catch (error) {
      alert(`${error} In initChat`);
    }
  }
);

export const getChats = createAsyncThunk("getChats", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "chats"));
    let chatObj: Partial<Chat> = {};
    querySnapshot.forEach((doc) => {
      chatObj = { ...chatObj, [doc.id]: { ...doc.data() } } as Chat;
    });
    return chatObj;
  } catch (error) {
    alert(`${error} In getChats`);
  }
});
