# SF-Chat

SF-Chat is a real-time chat application built with **React**, **TypeScript**, **Redux Toolkit**, and **Firebase**. It allows users to register, log in, and exchange messages in real-time. The app also supports features like message status updates, user search, and profile management.

---

## Features

- **Authentication**: User registration and login using Firebase Authentication.
- **Real-Time Messaging**: Messages are updated in real-time using Firestore.
- **Message Status**: Messages have statuses (`SENT`, `ARRIVED`, `SEEN`).
- **User Management**: Search users and manage user profiles with avatars.
- **Responsive Design**: Fully responsive UI built with SCSS.
- **State Management**: Global state managed using Redux Toolkit and Context API.

---

## Technologies Used

- **Frontend**: React, TypeScript, SCSS
- **State Management**: Redux Toolkit, Context API
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tool**: Vite
- **Icons**: React Icons

---

## Firebase Configuration

The app uses Firebase for authentication, Firestore for real-time database, and Storage for profile avatars. Ensure the following Firebase services are enabled in your project:

- **Authentication**: Email/Password provider.
- **Firestore**: Set up Firestore database.
- **Storage**: Configure storage rules as defined in storage.rules.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# sfChat
