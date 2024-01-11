import { uploadBytes, ref } from "firebase/storage";
import { storageRef } from "../../App";

export async function uploadAvatar(e: Event, file, uid: string) {
  e.stopPropagation();
  e.preventDefault();

  try {
    await uploadBytes(ref(storageRef, uid), file);
  } catch (error) {
    alert(error);
  }
}
