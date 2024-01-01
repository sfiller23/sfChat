import { ChatIds } from "./chat";

export interface User {
  displayName: string;
  email: string;
  loggedIn: boolean;
  userId: string;
  chatIds?: ChatIds;
  newMessage?: boolean;
}
