import { User } from "./auth";

export enum MessageStatus {
  SENT,
  ARRIVED,
  SEEN,
}

export interface Message {
  uid?: string;
  displayName: string;
  userId: string;
  text: string;
  sentTime: number;
  status?: MessageStatus;
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
  writing?: boolean;
}
