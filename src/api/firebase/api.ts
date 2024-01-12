import { uploadBytes, ref } from "firebase/storage";
import { storage } from "../../App";

export async function uploadAvatar(e: Event, file, uid: string) {
  e.stopPropagation();
  e.preventDefault();

  const storageRef = ref(storage, uid);

  try {
    await uploadBytes(storageRef, file);
  } catch (error) {
    alert(error);
  }
}
