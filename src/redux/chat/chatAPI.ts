import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../App";
import { collection, getDocs } from "firebase/firestore";
import { User } from "../../interfaces/auth/auth";

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
    alert(error);
  }
});
