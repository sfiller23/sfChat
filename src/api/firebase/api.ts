import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../App";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export async function uploadAvatar(
  e: Event,
  file: File | Blob,
  userId: string
) {
  e.stopPropagation();
  e.preventDefault();

  const storageRef = ref(storage, `profileImages/${userId}`);

  try {
    await uploadBytes(storageRef, file);
  } catch (error) {
    alert(error);
  }
}

export async function setLoggedInState(
  loggedInStatus: boolean,
  userId: string
) {
  try {
    await updateDoc(doc(db, "users", userId), {
      loggedIn: loggedInStatus,
    });
  } catch (error) {
    alert(error);
  }
}

export async function login(email: string, password: string) {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    await setLoggedInState(true, credentials.user.uid);
    return credentials;
  } catch (error) {
    alert(error);
  }
}

export async function register(
  email: string,
  password: string,
  displayName: string
) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = credentials.user.uid;
    await setDoc(doc(db, "users", userId), {
      userId,
      displayName,
      email,
      loggedIn: true,
    });
    return credentials;
  } catch (error) {
    alert(error);
  }
}

export async function getAvatar(userId: string): Promise<string | undefined> {
  const storageRef = ref(storage);
  try {
    const imgUrl = await getDownloadURL(
      ref(storageRef, `profileImages/${userId}`)
    );
    return imgUrl;
  } catch (error) {
    alert(error);
  }
}
