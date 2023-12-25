export interface ChatIds {
  [chatId: string]: { active: boolean };
}

export interface User {
  displayName: string;
  email: string;
  loggedIn: boolean;
  uid: string;
  chatIds: ChatIds;
}
