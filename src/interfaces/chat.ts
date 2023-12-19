import { User } from "./auth";

export interface Messages {
  displayName: string;
  sentTime: Date;
  text: string;
  uid: string;
}

export interface Chat {
  uid: string;
  firstUser: User;
  secondUser: User;
  messages: Messages[];
  startDate: Date;
}
