import { User } from "./auth";

export interface Message {
  uid?: string;
  displayName: string;
  text: string;
  sentTime: number;
}

export interface Chats {
  [uid: string]: {
    firstUser: User;
    secondUser: User;
    messages: Message[];
  };
}

export interface ChatObj {
  uid: string;
  firstUser: User;
  secondUser: User;
  messages: Message[];
}
