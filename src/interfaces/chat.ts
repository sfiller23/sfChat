import { User } from "./auth";

export interface Messages {
  uid?: string;
  displayName: string;
  sentTime: Date;
  text: string;
}

export interface Chat {
  [uid: string]: {
    firstUser: User;
    secondUser: User;
    messages: Messages[];
    startDate: number;
  };
}

export interface preDefinedChat {
  firstUser: User;
  secondUser: User;
  messages: Messages[];
  startDate: number;
}
