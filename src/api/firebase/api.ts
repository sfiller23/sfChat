import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../../firebase";

/**
 * Uploads a user's avatar to Firebase Storage.
 *
 * @param e - The event object to prevent default behavior.
 * @param file - The file or blob to be uploaded.
 * @param userId - The ID of the user uploading the avatar.
 */
export async function uploadAvatar(
  e: Event,
  file: File | Blob,
  userId: string
) {
  e.stopPropagation();
  e.preventDefault();

  const storageRef = ref(storage, `profileImages/${userId}`);

  try {
    await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
  } catch (error) {
    alert(error);
  }
}
/**
 * Updates the logged-in state of a user in Firestore.
 *
 * @param loggedInStatus - The new logged-in status (true or false).
 * @param userId - The ID of the user whose status is being updated.
 */
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

  const imgUrl = await getDownloadURL(
    ref(storageRef, `profileImages/${userId}`)
  );
  return imgUrl;
}
