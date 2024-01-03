import { MessageStatus } from "../constants/enums";
import { User } from "./auth";

export interface Message {
  displayName: string;
  userId: string;
  text: string;
  sentTime: number;
  status?: MessageStatus;
  index?: number;
  chatId?: string;
}

export interface Chats {
  [chatId: string]: ChatObj;
}

export interface ChatObj {
  chatId: string;
  firstUser: User;
  secondUser: User;
  messages: Message[];
  writing?: { status: boolean; writerID: string };
}

export interface ChatIds {
  [chatId: string]: { active: boolean };
}
