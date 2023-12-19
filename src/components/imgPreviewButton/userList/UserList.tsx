import { memo, useContext, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import { getUsers } from "../../../redux/chat/chatAPI";
import { AppContext } from "../../../context/appContext/AppContext";
import { AuthContext } from "../../../context/authContext/AuthContext";
import "./_user-list.scss";

export const UserList = () => {
  const authContext = useContext(AuthContext);
  const users = useAppSelector((state) => state.chatReducer.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {users.map((user) => {
          console.log(user);
          if (authContext?.state.user?.uid !== user.uid) {
            return (
              <li key={user.uid} className="list-item">
                <div
                  className={`is-loggedin-icon ${
                    user.loggedIn ? "logged-in" : "logged-out"
                  }`}
                ></div>
                {user.displayName}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default memo(UserList);
