import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../App";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { User } from "../../interfaces/auth";
import { Chat, preDefinedChat } from "../../interfaces/chat";
import { v4 as uuid } from "uuid";

export const getUserByUid = createAsyncThunk(
  "getUserByUid",
  async (uid: string) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot, "from users");
    try {
    } catch (error) {
      alert(`${error} In getUserByUid`);
    }
  }
);

export const getUsers = createAsyncThunk("getUsers", async () => {
  //const q = query(collection(db, "users"), where("displayName", "==", "me"));

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
  async (chatObj: preDefinedChat) => {
    const uid = uuid();
    try {
      await setDoc(doc(db, "chats", uid), {
        firstUser: chatObj.firstUser,
        secondUser: chatObj.secondUser,
        messages: chatObj.messages,
        startDate: chatObj.startDate,
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
